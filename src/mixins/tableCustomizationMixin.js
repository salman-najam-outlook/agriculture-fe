export default {
    methods: {
      getTablePrefs(tableKey) {
        const savedPrefs = localStorage.getItem(`TABLE_PREFS_${tableKey}`);
        return savedPrefs ? JSON.parse(savedPrefs) : null;
      },
      setTablePrefs(tableKey, prefs) {
        localStorage.setItem(`TABLE_PREFS_${tableKey}`, JSON.stringify(prefs));
      },
      clearTablePrefs(tableKey) {
        localStorage.removeItem(`TABLE_PREFS_${tableKey}`);
      }
    }
  }