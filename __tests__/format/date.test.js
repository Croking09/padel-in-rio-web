import { formatDate, formatMonth } from "@/lib/utils";

describe("formatDate", () => {
  describe("Default format (dd/MM/yyyy)", () => {
    it("should format a date correctly with the default format", () => {
      const result = formatDate("2024-03-15");
      expect(result).toBe("15/03/2024");
    });

    it("should add leading zeros to single-digit days", () => {
      const result = formatDate("2024-03-05");
      expect(result).toBe("05/03/2024");
    });

    it("should add leading zeros to single-digit months", () => {
      const result = formatDate("2024-01-15");
      expect(result).toBe("15/01/2024");
    });

    it("should handle the last day of the year", () => {
      const result = formatDate("2024-12-31");
      expect(result).toBe("31/12/2024");
    });

    it("should handle the first day of the year", () => {
      const result = formatDate("2024-01-01");
      expect(result).toBe("01/01/2024");
    });
  });

  describe("Custom formats", () => {
    it("should format a date with custom format yyyy-MM-dd", () => {
      const result = formatDate("2024-03-15", "yyyy-MM-dd");
      expect(result).toBe("2024-03-15");
    });

    it("should format a date with custom format MM/dd/yyyy (american style)", () => {
      const result = formatDate("2024-03-15", "MM/dd/yyyy");
      expect(result).toBe("03/15/2024");
    });

    it("should format a date with custom format dd-MM-yyyy", () => {
      const result = formatDate("2024-03-15", "dd-MM-yyyy");
      expect(result).toBe("15-03-2024");
    });

    it("should include hours and minutes when requested", () => {
      const result = formatDate("2024-03-15T14:30:00", "dd/MM/yyyy HH:mm");
      expect(result).toBe("15/03/2024 14:30");
    });

    it("should format only the hour", () => {
      const result = formatDate("2024-03-15T09:05:00", "HH:mm");
      expect(result).toBe("09:05");
    });

    it("should format a date with custom format yyyy/MM/dd - HH:mm", () => {
      const result = formatDate("2024-03-15T14:30:00", "yyyy/MM/dd - HH:mm");
      expect(result).toBe("2024/03/15 - 14:30");
    });
  });

  describe("Invalid dates", () => {
    it("should return the original string if the date is invalid", () => {
      const invalidDate = "not-a-date";
      const result = formatDate(invalidDate);
      expect(result).toBe(invalidDate);
    });

    it("should return the original string if the date is empty", () => {
      const result = formatDate("");
      expect(result).toBe("");
    });

    it("should return the original string for invalid dates", () => {
      const invalidDate = "2024-13-45";
      const result = formatDate(invalidDate);
      expect(result).toBe(invalidDate);
    });

    it("should return the original string for random text", () => {
      const randomText = "abc123xyz";
      const result = formatDate(randomText);
      expect(result).toBe(randomText);
    });
  });

  describe("Different input formats", () => {
    it("should handle ISO complete date format", () => {
      const result = formatDate("2024-03-15T10:30:45.123Z");
      expect(result).toMatch(/\d{2}\/\d{2}\/2024/);
    });

    it("should handle dates with only year-month-day", () => {
      const result = formatDate("2024-03-15");
      expect(result).toBe("15/03/2024");
    });

    it("debe manejar timestamps en milisegundos", () => {
      const timestamp = "1710460800000"; // 2024-03-15 00:00:00 UTC
      const date = new Date(parseInt(timestamp));
      const result = formatDate(date.toISOString());
      expect(result).toMatch(/\d{2}\/\d{2}\/2024/);
    });
  });

  describe("Edge cases", () => {
    it("should handle leap years correctly", () => {
      const result = formatDate("2024-02-29");
      expect(result).toBe("29/02/2024");
    });

    it("should handle midnight (00:00)", () => {
      const result = formatDate("2024-03-15T00:00:00", "HH:mm");
      expect(result).toBe("00:00");
    });

    it("should handle the last minute of the day (23:59)", () => {
      const result = formatDate("2024-03-15T23:59:00", "HH:mm");
      expect(result).toBe("23:59");
    });
  });
});

describe("formatMonth", () => {
  describe("Valid months", () => {
    it('should return "Enero" for month 1', () => {
      expect(formatMonth(1)).toBe("Enero");
    });

    it('should return "Febrero" for month 2', () => {
      expect(formatMonth(2)).toBe("Febrero");
    });

    it('should return "Marzo" for month 3', () => {
      expect(formatMonth(3)).toBe("Marzo");
    });

    it('should return "Abril" for month 4', () => {
      expect(formatMonth(4)).toBe("Abril");
    });

    it('should return "Mayo" for month 5', () => {
      expect(formatMonth(5)).toBe("Mayo");
    });

    it('should return "Junio" for month 6', () => {
      expect(formatMonth(6)).toBe("Junio");
    });

    it('should return "Julio" for month 7', () => {
      expect(formatMonth(7)).toBe("Julio");
    });

    it('should return "Agosto" for month 8', () => {
      expect(formatMonth(8)).toBe("Agosto");
    });

    it('should return "Septiembre" for month 9', () => {
      expect(formatMonth(9)).toBe("Septiembre");
    });

    it('should return "Octubre" for month 10', () => {
      expect(formatMonth(10)).toBe("Octubre");
    });

    it('should return "Noviembre" for month 11', () => {
      expect(formatMonth(11)).toBe("Noviembre");
    });

    it('should return "Diciembre" for month 12', () => {
      expect(formatMonth(12)).toBe("Diciembre");
    });
  });

  describe("Invalid values", () => {
    it('should return "Mes 0" for 0', () => {
      expect(formatMonth(0)).toBe("Mes 0");
    });

    it('should return "Mes 13" for 13', () => {
      expect(formatMonth(13)).toBe("Mes 13");
    });

    it('should return "Mes -1" for negative numbers', () => {
      expect(formatMonth(-1)).toBe("Mes -1");
    });

    it('should return "Mes 100" for large numbers', () => {
      expect(formatMonth(100)).toBe("Mes 100");
    });
  });

  describe("Loop through all months", () => {
    it("should return the correct name for all months of the year", () => {
      const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];

      monthNames.forEach((name, index) => {
        expect(formatMonth(index + 1)).toBe(name);
      });
    });
  });
});

describe("Integration formatDate and formatMonth", () => {
  it("formatMonth should correspond to the month extracted from formatDate", () => {
    const date = "2024-03-15";
    const formatted = formatDate(date, "MM");
    const monthNumber = parseInt(formatted);
    const monthName = formatMonth(monthNumber);

    expect(monthName).toBe("Marzo");
  });

  it("should work correctly for all months", () => {
    const expectedMonths = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    expectedMonths.forEach((monthName, index) => {
      const month = (index + 1).toString().padStart(2, "0");
      const date = `2024-${month}-15`;
      const formattedMonth = formatDate(date, "MM");
      const monthNumber = parseInt(formattedMonth);

      expect(formatMonth(monthNumber)).toBe(monthName);
    });
  });
});
