import EnhancedSubjectPage from "@/components/subjects/single/SubjectPage";
import { useLocalSearchParams } from "expo-router";

export default function Wrapper() {
  const { subjectId } = useLocalSearchParams();

  return (
    <EnhancedSubjectPage subjectId={subjectId as string} />
  )
}