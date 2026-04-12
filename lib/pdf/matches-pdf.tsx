import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Match } from "@/lib/types/match";

const CELL_HEIGHT = 22;
const BORDER = 1;
const BORDER_COLOR = "#000";

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    flexDirection: "column",
  },

  jornadaTitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
  },

  category: {
    marginBottom: 14,
  },

  categoryTitle: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "bold",
  },

  matchRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 6,
  },

  combo: {
    width: "33.33%",
    paddingHorizontal: 2,
  },

  comboInner: {
    flexDirection: "row",
    width: "100%",
  },

  sideCell: {
    width: "10%",
    height: CELL_HEIGHT * 2,
    borderTopWidth: BORDER,
    borderBottomWidth: BORDER,
    borderLeftWidth: BORDER,
    borderRightWidth: 0,
    borderColor: BORDER_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },

  sideCellRight: {
    width: "10%",
    height: CELL_HEIGHT * 2,
    borderTopWidth: BORDER,
    borderBottomWidth: BORDER,
    borderLeftWidth: 0,
    borderRightWidth: BORDER,
    borderColor: BORDER_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "80%",
  },

  cellTopLeft: {
    width: "50%",
    height: CELL_HEIGHT,
    borderTopWidth: BORDER,
    borderBottomWidth: BORDER,
    borderLeftWidth: BORDER,
    borderRightWidth: BORDER,
    borderColor: BORDER_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  cellTopRight: {
    width: "50%",
    height: CELL_HEIGHT,
    borderTopWidth: BORDER,
    borderBottomWidth: BORDER,
    borderLeftWidth: 0,
    borderRightWidth: BORDER,
    borderColor: BORDER_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  cellBottomLeft: {
    width: "50%",
    height: CELL_HEIGHT,
    borderTopWidth: 0,
    borderBottomWidth: BORDER,
    borderLeftWidth: BORDER,
    borderRightWidth: BORDER,
    borderColor: BORDER_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  cellBottomRight: {
    width: "50%",
    height: CELL_HEIGHT,
    borderTopWidth: 0,
    borderBottomWidth: BORDER,
    borderLeftWidth: 0,
    borderRightWidth: BORDER,
    borderColor: BORDER_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 9,
  },
});

export function MatchesPdf({
  matchesByDay,
}: {
  matchesByDay: Record<number, Record<string, Match[]>>;
}) {
  return (
    <Document>
      {Object.entries(matchesByDay).map(([day, categories]) => (
        <Page key={day} size="A4" style={styles.page}>
          <Text style={styles.jornadaTitle}>Jornada {day}</Text>

          {Object.entries(categories).map(([category, matches]) => (
            <View key={category} style={styles.category}>
              <Text style={styles.categoryTitle}>{category}</Text>

              {matches.map((match, idx) => {
                const players = match.players.map(
                  (p) => p.nickname || p.full_name,
                );

                if (players.length !== 4) return null;

                const combos = [
                  [players[0], players[2], players[1], players[3]], // 0-1 vs 2-3
                  [players[0], players[1], players[2], players[3]], // 0-2 vs 1-3
                  [players[0], players[1], players[3], players[2]], // 0-3 vs 1-2
                ];

                return (
                  <View key={idx} style={styles.matchRow}>
                    {combos.map((combo, i) => (
                      <View key={i} style={styles.combo}>
                        <View style={styles.comboInner}>
                          <View style={styles.sideCell}>
                            <Text style={styles.text}> </Text>
                          </View>

                          <View style={styles.grid}>
                            <View style={styles.cellTopLeft}>
                              <Text style={styles.text}>{combo[0]}</Text>
                            </View>
                            <View style={styles.cellTopRight}>
                              <Text style={styles.text}>{combo[1]}</Text>
                            </View>
                            <View style={styles.cellBottomLeft}>
                              <Text style={styles.text}>{combo[2]}</Text>
                            </View>
                            <View style={styles.cellBottomRight}>
                              <Text style={styles.text}>{combo[3]}</Text>
                            </View>
                          </View>

                          <View style={styles.sideCellRight}>
                            <Text style={styles.text}> </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
}
