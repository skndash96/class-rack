import { usePreferences } from '@/contexts/Preferences';
import { Preference } from '@/db/models/Preference';
import { Model, Q } from '@nozbe/watermelondb';
import { sanitizedRaw } from '@nozbe/watermelondb/RawRecord';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  List,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme
} from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import { database } from '../../db/index';

const SettingsScreen = () => {
  const theme = useTheme()
  const { attendanceThresholdPercentage } = usePreferences()
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isChangingField, setIsChangingField] = useState<{
    type: "string"|"number",
    field: string;
    value: string;
  } | null>(null);
  
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogType, setDialogType] = useState<"import" | "export">('import');

  const handleFieldChange = (newValue: string) => {
    if (isChangingField) {
      setIsChangingField({
        ...isChangingField,
        value: newValue
      });
    }
  };

  const handleFieldSave = async() => {
    if (isChangingField) {
      const records = await database.collections.get<Preference>('preferences').query(Q.where("name", isChangingField.field)).fetch();

      if (records.length !== 1) {
        Toast.show('Failed to updated Preference', Toast.SHORT);
        setIsChangingField(null)
        return
      }

      const r = records[0]

      const newR = await database.write(async () => {
        await r.update(preference => {
            preference.value = isChangingField.value
        })

        return r
      })
    
      Toast.show('Field updated successfully', Toast.SHORT);
      setIsChangingField(null);
    }
  };

  const handleFieldCancel = () => {
    setIsChangingField(null);
  };

  const exportDatabase = async () => {
    try {
      setIsExporting(true);
      
      // Get all tables data including deleted records
      const collections = database.collections.map;
      const exportData = {} as Record<string, any[]>;

      for (const [tableName, collection] of Object.entries(collections)) {
        const allRecords = await collection.query().fetch();
        const deletedRecords = await collection.query(Q.where('_status', 'deleted')).fetch();

        // Combine active and deleted records
        const combinedRecords = [...allRecords, ...deletedRecords];
        exportData[tableName] = combinedRecords.map(record => record._raw);
      }
      
      // Create JSON file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `database_export_${timestamp}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(
        fileUri, 
        JSON.stringify(exportData, null, 2)
      );
      
      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Database',
        });
      } else {
        Toast.show('Sharing not available on this device', Toast.LONG);
      }

      Toast.show('Database exported successfully', Toast.SHORT);
    } catch (error: any) {
      console.error('Export error:', error);
      Alert.alert('Export Error', `Failed to export database: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const importDatabase = async () => {
    try {
      setIsImporting(true);
      
      // Pick file
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        setIsImporting(false);
        return;
      }
      
      // Read file content
      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const importData = JSON.parse(fileContent) as Record<string, any[]>;

      // Perform database import within a transaction
      await database.write(async () => {
        // Clear existing data (optional - you might want to merge instead)
        const collections = database.collections.map;

        for (const [tableName, collection] of Object.entries(collections)) {
          const existingRecords = await collection.query().fetch() as Model[];
          await Promise.all(
            existingRecords.map(record => record.destroyPermanently())
          );
        }

        // Import new data
        for (const [tableName, records] of Object.entries(importData)) {
          const collection = collections[tableName];
          if (collection && records) {
            await Promise.all(
              records.map(async (recordData) => {
                await collection.create(record => {
                  record._raw = sanitizedRaw(recordData, collection.schema)
                });
              })
            );
          }
        }
      });

      Toast.show('Database imported successfully', Toast.SHORT);
    } catch (error: any) {
      console.error('Import error:', error);
      Alert.alert('Import Error', `Failed to import database: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const showConfirmDialog = (type: typeof dialogType) => {
    setDialogType(type);
    setDialogVisible(true);
  };

  const handleDialogConfirm = () => {
    setDialogVisible(false);
    if (dialogType === 'export') {
      exportDatabase();
    } else if (dialogType === 'import') {
      importDatabase();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section title='Preferences'>
        <List.Item
          title="Attendance Threshold"
          description="Set the minimum percentage"
          left={props => <List.Icon {...props} icon="percent" />}
          onPress={() => setIsChangingField({
            type: 'number',
            field: 'attendance_threshold_percentage',
            value: attendanceThresholdPercentage.toString()
          })}
          right={props => isChangingField ? (
            <ActivityIndicator
              animating={true}
              size="small"
              style={styles.loader}
            />
          ) : <Text variant='titleMedium'>
            {attendanceThresholdPercentage}%
          </Text>}
        />
        <List.Item
          title="Export Database"
          description="Export all your data to a JSON file."
          left={props => <List.Icon {...props} icon="download" />}
          onPress={() => showConfirmDialog('export')}
          right={props => isExporting && (
            <ActivityIndicator
              animating={true}
              size="small"
              style={styles.loader}
            />
          )}
        />
        <List.Item
          title="Import Database"
          description="Import data from a JSON file."
          left={props => <List.Icon {...props} icon="upload" />}
          onPress={() => showConfirmDialog('import')}
          right={props => isImporting && (
            <ActivityIndicator
              animating={true}
              size="small"
              style={styles.loader}
            />
          )}
        />
      </List.Section>

      {/* Field Modal */}
      <Portal>
        <Modal
          visible={!!isChangingField}
          onDismiss={handleFieldCancel}
          contentContainerStyle={[styles.modalContainer, {
            backgroundColor: theme.colors.elevation.level3
          }]}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Edit {isChangingField?.field?.split("_").map(w => w ? w[0].toUpperCase() + w.substring(1) : "").join(" ").trim()}
          </Text>
          
          <TextInput
            mode="outlined"
            label={isChangingField?.field?.split("_").map(w => w ? w[0].toUpperCase() + w.substring(1) : "").join(" ").trim()}
            value={isChangingField?.value || ''}
            onChangeText={handleFieldChange}
            keyboardType={isChangingField?.type === 'number' ? 'numeric' : 'default'}
            style={styles.textInput}
          />
          
          <Button
            mode="contained"
            onPress={handleFieldSave}
            style={styles.saveButton}
          >
            Save
          </Button>
          
          <Button
            mode="text"
            onPress={handleFieldCancel}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </Modal>
      </Portal>
        
      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>
            {dialogType === 'export' ? 'Export Database' : 'Import Database'}
          </Dialog.Title>
          <Dialog.Content>
            <Text>
              {dialogType === 'export'
                ? 'This will export all your data to a JSON file. You can then share or save this file as a backup.'
                : 'This will replace all current data with the data from the selected file. This action cannot be undone.'}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDialogConfirm}>
              {dialogType === 'export' ? 'Export' : 'Import'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginVertical: 8,
    position: 'relative',
  },
  button: {
    marginVertical: 4,
  },
  buttonContent: {
    height: 48,
  },
  loader: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  divider: {
    marginVertical: 16,
  },
  modalContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
    minHeight: 200,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    marginBottom: 16,
  },
  saveButton: {
    marginBottom: 8,
  },
  cancelButton: {
    marginBottom: 8,
  },
});

export default SettingsScreen;