import { useLocalSearchParams } from "expo-router";
import EnhancedSubjectPage from "./components/SubjectPage";

export default function Wrapper() {
  const { subjectId } = useLocalSearchParams();

  return (
    <EnhancedSubjectPage subjectId={subjectId as string} />
  )
}