// Path: src/constants/theme.js
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { configureFonts, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import colors from './colors';

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Inter-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Inter-Medium',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Poppins-Bold',
      fontWeight: 'normal',
    },
    monospace: {
      fontFamily: 'JetBrainsMono-Regular',
      fontWeight: 'normal',
    },
  },
  ios: {
    regular: {
      fontFamily: 'Inter-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Inter-Medium',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Poppins-Bold',
      fontWeight: 'normal',
    },
    monospace: {
      fontFamily: 'JetBrainsMono-Regular',
      fontWeight: 'normal',
    },
  },
  android: {
    regular: {
      fontFamily: 'Inter-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Inter-Medium',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Poppins-Bold',
      fontWeight: 'normal',
    },
    monospace: {
      fontFamily: 'JetBrainsMono-Regular',
      fontWeight: 'normal',
    },
  }
};

// Light theme
export const lightTheme = {
  ...MD3LightTheme,
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryLight,
    background: colors.white,
    surface: colors.white,
    text: colors.darkText,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
    card: colors.whiteSmoke,
    border: colors.lightGray,
    notification: colors.primaryDark,
    codeBackground: colors.lightCodeBg,
    codeText: colors.darkCodeText,
    icon: colors.darkIcon,
    disabled: colors.disabledLight,
    placeholder: colors.grayText,
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  fonts: configureFonts({config: fontConfig}),
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};

// Dark theme
export const darkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...MD3DarkTheme.colors,
    primary: colors.primaryLight,
    primaryContainer: colors.primary,
    secondary: colors.secondaryLight,
    secondaryContainer: colors.secondary,
    background: colors.darkBackground,
    surface: colors.darkSurface,
    text: colors.lightText,
    error: colors.errorLight,
    success: colors.successLight,
    warning: colors.warningLight,
    info: colors.infoLight,
    card: colors.darkCard,
    border: colors.darkBorder,
    notification: colors.primaryLight,
    codeBackground: colors.darkCodeBg,
    codeText: colors.lightCodeText,
    icon: colors.lightIcon,
    disabled: colors.disabledDark,
    placeholder: colors.lightGrayText,
    backdrop: 'rgba(0, 0, 0, 0.8)',
  },
  fonts: configureFonts({config: fontConfig}),
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};