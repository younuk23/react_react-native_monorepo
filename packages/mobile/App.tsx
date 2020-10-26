/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, StatusBar} from 'react-native';
import theme from '@mono/theme';
import {getFake, hello} from '@mono/lib';

declare const global: {HermesInternal: null | {}};

const App = () => {
  interface IData {
    userId: number;
    id: number;
    title: string;
    complete: boolean;
  }

  const [data, setData] = useState<IData>({
    userId: 0,
    id: 0,
    title: '',
    complete: false,
  });

  useEffect(() => {
    getFake(3).then((res: any) => setData(res));
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: theme.blue}}>{data?.title}</Text>
        <Text>{hello}</Text>
      </SafeAreaView>
    </>
  );
};

export default App;
