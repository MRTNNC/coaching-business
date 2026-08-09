import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Plan } from "@/lib/types";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 20, marginBottom: 4 },
  subtitle: { fontSize: 11, color: "#555555", marginBottom: 24 },
  section: { marginBottom: 16 },
  heading: { fontSize: 13, marginBottom: 6, fontFamily: "Helvetica-Bold" },
  item: { marginBottom: 3 },
  bullet: { marginRight: 6 },
  row: { flexDirection: "row" },
  notes: { marginTop: 20, fontSize: 10, color: "#555555" },
});

export function PlanDocument({
  plan,
  clientName,
}: {
  plan: Plan;
  clientName: string;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{plan.title}</Text>
        <Text style={styles.subtitle}>
          {clientName} ·{" "}
          {plan.plan_type === "workout" ? "Workout plan" : "Nutrition plan"} ·
          v{plan.version} · {new Date(plan.created_at).toLocaleDateString()}
        </Text>

        {plan.content.sections.map((section, i) => (
          <View key={i} style={styles.section} wrap={false}>
            <Text style={styles.heading}>{section.heading}</Text>
            {section.items.map((item, j) => (
              <View key={j} style={styles.row}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.item}>{item}</Text>
              </View>
            ))}
          </View>
        ))}

        {plan.content.notes && (
          <Text style={styles.notes}>{plan.content.notes}</Text>
        )}
      </Page>
    </Document>
  );
}
