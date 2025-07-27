import { View, StyleSheet } from "react-native";
import { Typography, Icon } from "../components/ui";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Typography variant="h1">Welcome to Buildi3! 🚀</Typography>

      <Typography variant="bodyMedium" style={styles.subtitle}>
        Your app is ready to build amazing things
      </Typography>

      {/* Icon Examples - showing different sizes and colors */}
      <View style={styles.iconSection}>
        <Typography variant="h3" style={styles.sectionTitle}>
          Icon Examples
        </Typography>

        <View style={styles.iconRow}>
          <Icon name="home" size="sm" />
          <Icon name="heart" size="md" color="red" />
          <Icon name="settings" size="lg" color="text-secondary" />
          <Icon name="star" size="xl" color="yellow" />
        </View>

        <View style={styles.iconRow}>
          <Icon
            name="user"
            size="lg"
            color="blue"
            onPress={() => console.log("User icon pressed!")}
          />
          <Icon
            name="bell"
            size="lg"
            color="text-primary"
            onPress={() => console.log("Bell icon pressed!")}
          />
          <Icon
            name="search"
            size="lg"
            color="text-secondary"
            onPress={() => console.log("Search icon pressed!")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  subtitle: {
    marginTop: 10,
    textAlign: "center",
    marginBottom: 40,
  },
  iconSection: {
    alignItems: "center",
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});
