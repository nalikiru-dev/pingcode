import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export default function HomeScreen() {
  const [value, setValue] = useState<string>('');

    const getColor = (selected: boolean): string => {
      return selected ? 'red' : 'black';
    };

    const onValueChange = (v: string): void => {
        console.log('onValueChange', v);
        setValue(v);
    };

  return (
   <View style={styles.stepContainer}>
      <TextInput 
      value={value}
      onChangeText={onValueChange}
      />
      </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    color: '#808080',
    fontSize: 24,
    fontWeight: 'bold',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
