import { DEFAULT_ATTENDANCE_THRESHOLD_PERCENTAGE } from "@/constants/defaultPreferences";
import { database } from "@/db";
import { Preference } from "@/db/models/Preference";
import { createContext, useContext, useEffect, useState } from "react";

export interface PreferenceContextType {
  attendanceThresholdPercentage: number;
}

const PreferencesContext = createContext<PreferenceContextType | undefined>(undefined);

export const PreferencesProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [attendanceThresholdPercentage, setAttendanceThresholdPercentage] = useState(DEFAULT_ATTENDANCE_THRESHOLD_PERCENTAGE);

  useEffect(() => {
    const subscription = database.get<Preference>('preferences').query().observe().subscribe(async prefs => {
      const preferences = new Map<string, Preference>();
      
      prefs.forEach(pref => {
        preferences.set(pref.name, pref);
      });
      
      const getValueOrCreateDefault = async (name: string, defaultValue: string) => {
        const pref = preferences.get(name);
        if (pref === undefined) {
          await database.write(async () => {
            await database.get<Preference>('preferences').create((p) => {
              p.name = name;
              p.value = defaultValue;
            });
          });

          return defaultValue;
        } else {
          return pref.value;
        }
      }

      const atp = await getValueOrCreateDefault('attendance_threshold_percentage', DEFAULT_ATTENDANCE_THRESHOLD_PERCENTAGE.toString())
      setAttendanceThresholdPercentage(parseInt(atp, 10))
    })

    return () => {
      subscription.unsubscribe();
    }
  }, [])

  return (
    <PreferencesContext.Provider value={{
      attendanceThresholdPercentage
    }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}