import EnhancedArchiveSubjectsList from '@/components/subjects/archived/ArchiveSubjectsList';
import { View } from 'react-native';

export default function ArchivedSubjects() {
  return (
    <View style={{
      flex: 1
    }}>
      <EnhancedArchiveSubjectsList />
    </View>
  )
}