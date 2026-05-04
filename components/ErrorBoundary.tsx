import { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import { C } from '@/lib/tokens';
import { t } from '@/lib/strings';

interface Props {
  children: ReactNode;
}

interface State {
  err: Error | null;
}

// Last-ditch error boundary so an unexpected render crash shows a recovery
// surface instead of the iOS red-screen / Android black-screen. Mounted at
// the root layout. In dev, Metro's overlay still fires first; in production
// builds this is what the user sees.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { err: null };

  static getDerivedStateFromError(err: Error): State {
    return { err };
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    // Hook a real reporter (Sentry, Bugsnag) here when wired.
    if (__DEV__) console.error('ErrorBoundary caught:', err, info);
  }

  reset = () => this.setState({ err: null });

  render() {
    if (!this.state.err) return this.props.children;

    return (
      <View style={{ flex: 1, backgroundColor: C.creamHi, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontFamily: 'Fraunces_400Regular', fontSize: 28, color: C.ink, marginBottom: 12, textAlign: 'center' }}>
          {t.errors.title}
        </Text>
        <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 14, color: C.dim, textAlign: 'center', marginBottom: 24, maxWidth: 280 }}>
          {t.errors.body}
        </Text>
        {__DEV__ && (
          <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 11, color: C.muted, textAlign: 'center', marginBottom: 24, maxWidth: 320 }}>
            {this.state.err.message}
          </Text>
        )}
        <Pressable
          onPress={this.reset}
          accessibilityRole="button"
          accessibilityLabel={t.cta.tryAgain}
          style={{ backgroundColor: C.apricot, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 999 }}
        >
          <Text style={{ color: C.paper, fontFamily: 'DMSans_600SemiBold', fontSize: 14 }}>{t.cta.tryAgain}</Text>
        </Pressable>
      </View>
    );
  }
}
