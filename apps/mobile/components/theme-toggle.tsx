import { MoonIcon, SunIcon } from 'phosphor-react-native';
import { Pressable } from 'react-native';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';
import { useAppTheme } from '@/contexts/app-theme-context';
import { useDaymarkColors } from '@/hooks/use-daymark-theme';
import { hapticLight } from '@/utils/haptics';

export function ThemeToggle() {
	const { toggleTheme, isLight } = useAppTheme();
	const colors = useDaymarkColors();

	return (
		<Pressable
			onPress={() => {
				hapticLight();
				toggleTheme();
			}}
			className="px-2.5"
		>
			{isLight ? (
				<Animated.View key="moon" entering={ZoomIn} exiting={FadeOut}>
					<MoonIcon size={22} weight="bold" color={colors.text} />
				</Animated.View>
			) : (
				<Animated.View key="sun" entering={ZoomIn} exiting={FadeOut}>
					<SunIcon size={22} weight="bold" color={colors.text} />
				</Animated.View>
			)}
		</Pressable>
	);
}
