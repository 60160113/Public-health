<script>
const thaiMonth = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];
export default {
  methods: {
    toThaiFormat(date) {
      if (date) {
        const DATE = new Date(date);
        return `${DATE.getDate()} ${thaiMonth[DATE.getMonth()]} ${
          DATE.getFullYear() + 543
        }`;
      } else {
        return "";
      }
    },
    toThaiFormatWithTime(date) {
      if (date) {
        return (
          this.toThaiFormat(date) + " " + new Date(date).toLocaleTimeString() + " น."
        );
      } else {
        return "";
      }
    },
  },
};
</script>