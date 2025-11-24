import { Image } from 'expo-image';
import { StyleSheet, View, ViewStyle } from 'react-native';

type LogoProps = {
  size?: number;
  style?: ViewStyle;
};

export function Logo({ size = 100, style }: LogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={require('../../assets/images/discover-logo.svg')}
        style={{ width: '100%', height: '100%' }}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
