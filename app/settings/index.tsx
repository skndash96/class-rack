import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Dialog,
  Divider,
  Paragraph,
  Portal,
  Title
} from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import { database } from '../../db/index';

const SettingsScreen = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogType, setDialogType] = useState<"import" | "export">('import');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const exportDatabase = async () => {
    try {
      setIsExporting(true);
      
      // Get all tables data
      const collections = database.collections.map;
      const exportData = {} as Record<string, any[]>;
      
      for (const [tableName, collection] of Object.entries(collections)) {
        const records = await collection.query().fetch();
        exportData[tableName] = records.map(record => record._raw);
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
          const existingRecords = await collection.query().fetch();
          await Promise.all(
            existingRecords.map(record => record.markAsDeleted())
          );
        }
        
        // Import new data
        for (const [tableName, records] of Object.entries(importData)) {
          const collection = collections[tableName];
          if (collection && records) {
            await Promise.all(
              records.map(async (recordData) => {
                await collection.create(record => {
                  // Copy all fields except internal ones
                  Object.keys(recordData).forEach(key => {
                    if (!key.startsWith('_') && key !== 'id') {
                      record[key] = recordData[key];
                    }
                  });
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
      <Card style={styles.card}>
        <Card.Content>
          <Title>Database Management</Title>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => showConfirmDialog('export')}
              disabled={isExporting || isImporting}
              icon="download"
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              {isExporting ? 'Exporting...' : 'Export Database'}
            </Button>
            
            {isExporting && (
              <ActivityIndicator 
                animating={true} 
                size="small" 
                style={styles.loader} 
              />
            )}
          </View>

          <Divider style={styles.divider} />

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => showConfirmDialog('import')}
              disabled={isExporting || isImporting}
              icon="upload"
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              {isImporting ? 'Importing...' : 'Import Database'}
            </Button>
            
            {isImporting && (
              <ActivityIndicator 
                animating={true} 
                size="small" 
                style={styles.loader} 
              />
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>
            {dialogType === 'export' ? 'Export Database' : 'Import Database'}
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              {dialogType === 'export'
                ? 'This will export all your data to a JSON file. You can then share or save this file as a backup.'
                : 'This will replace all current data with the data from the selected file. This action cannot be undone.'}
            </Paragraph>
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
    backgroundColor: '#f5f5f5',
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
});

export default SettingsScreen;