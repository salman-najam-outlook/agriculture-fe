<template>
  <div class="table-block">
    <div v-if="!preview">
      <div class="d-flex justify-space-between align-center mb-2">
        <span class="block-title">Table</span>
        <div class="d-flex align-center">
          <v-btn icon color="primary" class="mr-2" @click="showSettings = true">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
          <v-btn icon color="error" @click="$emit('delete')">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </div>
      </div>
      <!-- Table Settings -->
      <div class="table-settings pa-4 mb-4">
        <v-row>
          <v-col cols="12" md="3">
            <div class="settings-label">No. of Columns</div>
            <v-text-field v-model.number="columnsCount" type="number" min="1" outlined dense hide-details />
          </v-col>
          <v-col cols="12" md="3">
            <div class="settings-label">No. of Rows</div>
            <v-text-field v-model.number="rowsCount" type="number" min="1" outlined dense hide-details />
          </v-col>
        </v-row>
        <v-row v-for="(col, idx) in columnsCount" :key="idx">
          <v-col cols="12" md="3">
            <div class="settings-label">Column {{ idx + 1 }}</div>
            <v-text-field v-model="columns[idx].label" outlined dense hide-details placeholder="Column Name" />
          </v-col>
          <v-col cols="12" md="3">
            <div class="settings-label">Type</div>
            <v-select v-model="columns[idx].type" :items="columnTypes" outlined dense hide-details />
          </v-col>
        </v-row>
      </div>
      <!-- Table -->
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.label">{{ col.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rIdx) in rows" :key="rIdx">
              <td v-for="(col, cIdx) in columns" :key="cIdx">
                <v-text-field v-model="rows[rIdx][col.value]" outlined dense hide-details placeholder="Enter here"
                  @input="syncRowsToBlock" class="table-input" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Preview Mode -->
    <div v-else>
      <div class="table-responsive">
        <table class="custom-table preview-table">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.label">{{ col.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rIdx) in block.data || []" :key="rIdx">
              <td v-for="(col, cIdx) in columns" :key="cIdx" class="table-preview-cell">
                {{ row[col.value] || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ComponentSettingsDialog v-model="showSettings" :settings.sync="block.settings" />
  </div>
</template>

<script>
import ComponentSettingsDialog from '../ComponentSettingDialog.vue'

export default {
  name: 'TableBlock',
  components: { ComponentSettingsDialog },
  props: {
    block: {
      type: Object,
      required: true
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showSettings: false,
      columnTypes: ['Text', 'Number', 'Date'],
      columnsCount: 0,
      rowsCount: 0,
      columns: [],
      rows: []
    }
  },
  created() {
    // initialize local state from block if present
    this.loadFromBlock();
  },
  watch: {
    columnsCount() {
      this.adjustColumns();
      this.initRows();
      this.syncRowsToBlock();
    },
    rowsCount() {
      this.initRows();
      this.syncRowsToBlock();
    },
    columns: {
      handler() {
        this.initRows();
        this.syncColumnsToBlock();
      },
      deep: true
    },
    rows: {
      handler() {
        this.syncRowsToBlock();
      },
      deep: true
    },
    preview() {
      // when toggling preview/edit, ensure local columns/rows reflect the block
      this.loadFromBlock();
    }
  },
  methods: {
    loadFromBlock() {
      if (this.block && Array.isArray(this.block.headers) && this.block.headers.length) {
        this.columns = this.block.headers.map((h, idx) => ({
          label: h.label || `Column ${idx + 1}`,
          value: `col${idx + 1}`,
          type: h.type || 'Text'
        }));
        this.columnsCount = this.columns.length;
      }

      // hydrate rows from block.data (if present)
      if (this.block && Array.isArray(this.block.data) && this.block.data.length) {
        // deep clone to avoid mutating parent's reference directly
        this.rows = JSON.parse(JSON.stringify(this.block.data));
        this.rowsCount = this.rows.length;
      } else {
        // fallback: ensure local structures are consistent
        this.adjustColumns();
        this.initRows();
      }
    },
    adjustColumns() {
      // Add or remove columns to match columnsCount
      while (this.columns.length < this.columnsCount) {
        this.columns.push({
          label: `Column ${this.columns.length + 1}`,
          value: `col${this.columns.length + 1}`,
          type: 'Text'
        });
      }
      while (this.columns.length > this.columnsCount) {
        this.columns.pop();
      }
      this.columns.forEach((col, idx) => {
        col.value = `col${idx + 1}`;
      });
    },
    initRows() {
      // Ensure rows array matches rowsCount and columns
      while (this.rows.length < this.rowsCount) {
        const row = {};
        this.columns.forEach((col) => {
          row[col.value] = '';
        });
        this.rows.push(row);
      }
      while (this.rows.length > this.rowsCount) {
        this.rows.pop();
      }
      this.rows.forEach(row => {
        this.columns.forEach(col => {
          if (!(col.value in row)) row[col.value] = '';
        });
      });
    },
    syncRowsToBlock() {
      // Save the current rows to the block's data property
      this.$set(this.block, 'data', JSON.parse(JSON.stringify(this.rows)));
    },
    syncColumnsToBlock() {
      this.$set(this.block, 'headers', JSON.parse(JSON.stringify(
        this.columns.map(({label, type}) => ({
          label,
          type
        }))
      )));
    }
  }
}
</script>

<style scoped>
.table-block {
  background: #fafbfc;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  position: relative;
}

.block-title {
  font-size: 20px;
  font-weight: 700;
  color: #222;
}

.table-settings {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.settings-label {
  font-size: 15px;
  font-weight: 500;
  color: #222;
  margin-bottom: 8px;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 16px;
}

.custom-table th {
  background: #3fb17a;
  font-weight: 700;
  font-size: 17px;
  color: #fff;
  padding: 14px 8px;
  text-align: left;
}

.custom-table td {
  background: #fff;
  padding-right: 8px;
  border-radius: 4px;
  border-right: 1px solid #e0e0e0;
}

.table-input {
  width: 100%;
}

.table-preview-title {
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin-bottom: 18px;
  text-align: left;
}
.preview-table th {
  background: #3fb17a;
  color: #fff;
  font-weight: 700;
  font-size: 17px;
  padding: 14px 8px;
  text-align: left;
  border-radius: 0;
}

.preview-table td {
  color: #222;
  padding: 8px;
  border: none;
  background: #fff;
  font-size: 16px;
  font-family: inherit;
  text-align: left;
}

.preview-table tr:nth-child(even) td {
  background: #f3f3f3;
}

/* Remove border-radius for preview table */
.preview-table td,
.preview-table th {
  border-radius: 0 !important;
}

/* Optional: Add vertical alignment */
.preview-table td, .preview-table th {
  vertical-align: middle;
}
</style>