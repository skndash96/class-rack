import { handleAddSubject } from '@/services/subjects'
import React, { useState } from 'react'
import { FAB } from 'react-native-paper'
import SubjectModal from './SubjectModal'

export default function AddSubject() {
  const [visible, setVisible] = useState(false)

  return (
    <>
      {visible && (
        <SubjectModal
          title={"Add Subject"}
          initialSubject={null}
          onClose={() => setVisible(false)}
          onSubmit={async (params) => {
            await handleAddSubject(params)
            setVisible(false)
          }}
        />
      )}

      <FAB
        style={{
          marginHorizontal: 16,
          // position: 'absolute',
          // bottom: 24,
          // right: 16
        }}
        label='Add Subject'
        icon="plus"
        mode="elevated"
        elevation={0}
        onPress={() => setVisible(true)}
      />
    </>
  )
}