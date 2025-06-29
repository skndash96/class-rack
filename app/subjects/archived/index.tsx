import { View } from 'react-native';
import EnhancedArchiveSubjectsList from './components/ArchiveSubjectsList';

export default function ArchivedSubjects() {
  return (
    <View style={{
      flex: 1
    }}>
      <EnhancedArchiveSubjectsList />
    </View>
  )
}