export default {
  methods: {
    //Goal achive 
    async goalAchiveDownloadExcel() {
      this.startLoading();
      try {
        const data = this.goalsAchievedData.goalsList;
        const sheetData = data.map(row => {
          return {
            [this.$t('Farmer Name')]: row.name,
            [this.$t('Goals Achieved')]: row.goalsAchieved,
            [this.$t('Goals Failed')]: row.goalsFailed,
            [this.$t('Success Rate')]: row.successRatePercentage,
          }
        });
        const { data: blob } = await this.$http.post('/reports/generate-excel', {
          data: sheetData,
        }, { responseType: 'blob' });
        this.downloadBlob(blob, 'goalsReport.xlsx');
        this.stopLoading();
      } catch (error) {
        console.log(error);
        this.stopLoading();
      }
    },
    async goalAchiveDownloadCsv() {
      this.startLoading()
      try {
        const csvData = this.goalsAchievedData.goalsList
        let csv = `${this.$t('Farmer Name')}, ${this.$t('Goals Achieved')}, ${this.$t('Goals Failed')}, ${this.$t('Success Rate')}\n`;
        csvData.forEach((row) => {
          csv += [row.name, row.goalsAchieved, row.goalsFailed, row.successRatePercentage].join(',');
          csv += "\n";
        });

        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'goalsReport.csv';
        anchor.click();
        this.stopLoading()
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },
    async goalAchiveDownloadPdf() {
      this.startLoading()
      try {
        const list = this.goalsAchievedData.goalsList.map(goal => {
          const listItem = {
            'Farmer Name': goal.name,
            'Goals Failed': goal.goalsFailed,
            'Goals Achieved': goal.goalsAchieved,
            'Success Rate': goal.successRatePercentage ?? 0,
          };
          return listItem;
        })
        await this.$http.post(`/reports/pdfs`, {
          title: this.$t('Goals Achieved Report'),
          list,
          startDate: this.topChartStartDate,
          endDate: this.topChartEndDate,
        },
          {
            responseType: "arraybuffer",
          }
        ).then(({ data }) => {
          console.log(data)
          this.downloadBlobFile(data, "goalsAchievedReport.pdf");
          this.stopLoading();
        })
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },

    //Equipment
    async equipmentDownloadExcel() {
      console.log(this.equipmentData)
      this.startLoading();
      try {
        const data = this.equipmentData.equipmentList;
        const sheetData = data.map(row => ({
          [this.$t('Equipment Name')]: row.equipmentName,
          [this.$t('Region')]: row.region,
          [this.$t('Farmer')]: row.farmerCount,
          [this.$t('Counts')]: row.equipmentCount,
        }));
        const { data: blob } = await this.$http.post('/reports/generate-excel', {
          data: sheetData,
        }, { responseType: 'blob' });
        this.downloadBlob(blob, 'equipmentReport.xlsx');
        this.stopLoading();
      } catch (error) {
        console.error(error);
        this.stopLoading();
      }
    },
    async equipmentDownloadCsv() {
      this.startLoading()
      try {
        const csvData = this.equipmentData.equipmentList

        let csv = `${this.$t('Equipment Name')}, ${this.$t('Region')}, ${this.$t('Farmer')}, ${this.$t('Counts')}\n`;
        csvData.forEach((row) => {
          csv += [row.equipmentName, `"${row.region}"`, row.farmerCount, row.equipmentCount].join(',');
          csv += "\n";
        });

        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'equipmentReport.csv';
        anchor.click();
        this.stopLoading()
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },
    async equipmentDownloadPdf() {
      this.startLoading()
      try {
        await this.$http.post(`/reports/pdfs`, {
          title: this.$t('Equipment Report'),
          list: this.equipmentData.equipmentList.map(x => {
            return {
              'Equipment Name': x.equipmentName,
              'Region': x.region,
              'Farmer': x.farmerCount,
              'Counts': x.equipmentCount
            }
          }),
          startDate: this.topChartStartDate,
          endDate: this.topChartEndDate,
        },
          {
            responseType: "arraybuffer",
          }
        ).then(({ data }) => {
          console.log(data)
          this.downloadBlobFile(data, "equipmentReport.pdf");
          this.stopLoading();
        })
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },

    //Pest
    async pestDownloadExcel() {
      this.startLoading();
      try {
        const data = this.pestData.pestsList;
        const sheetData = data.map(row => ({
          [this.$t('Pest Name')]: row.name,
          [this.$t('Total Area')]: row.totalArea,
          [this.$t('Region')]: row.regions,
          [this.$t('Crop')]: row.crops,
        }));
        const { data: blob } = await this.$http.post('/reports/generate-excel', {
          data: sheetData,
        }, { responseType: 'blob' });
        this.downloadBlob(blob, 'pestReport.xlsx');
        this.stopLoading();
      } catch (error) {
        console.error(error);
        this.stopLoading();
      }
    },
    async pestDownloadCsv() {
      this.startLoading()
      try {
        const csvData = this.pestData.pestsList;
        let csv = `${this.$t('Pest Name')}, ${this.$t('Total Area')}, ${this.$t('Region')}, ${this.$t('Crop')}\n`;
        csvData.forEach((row) => {
          csv += [`"${row.name}"`, row.totalArea, `"${row.regions}"`, `"${row.crops}"`].join(',');
          csv += "\n";
        });
        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'pestReport.csv';
        anchor.click();
        this.stopLoading()
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },
    async pestDownloadPdf() {
      this.startLoading()
      try {
        await this.$http.post(`/reports/pdfs`, {
          title: this.$t('Pest Report'),
          list: this.pestData.pestsList.map(row => {
            return {
              'Pest Name': row.name,
              'Total Area': row.totalArea,
              'Region': row.regions,
              'Crop': row.crops
            }
          }),
          startDate: this.topChartStartDate,
          endDate: this.topChartEndDate,
        },
          {
            responseType: "arraybuffer",
          }
        ).then(({ data }) => {
          console.log(data)
          this.downloadBlobFile(data, "pestReport.pdf");
          this.stopLoading();
        })
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },

    //Crops
    async cropDownloadExcel() {
      this.startLoading();
      try {
        const data = this.cropsData.cropChart;
        const sheetData = data.map(row => ({
          [this.$t('Crop Name')]: row.cropName,
          [this.$t('Farmers')]: row.farmersCount,
          [this.$t('Farms')]: row.farmsCount,
          [this.$t('Planted')]: row.plantedCount,
          [this.$t('Planted Area')]: this.getArea(row.plantedArea),
          [this.$t('Harvested')]: row.harvestedCount,
          [this.$t('Yield/acre')]: row.yield,
        }));
        const { data: blob } = await this.$http.post('/reports/generate-excel', {
          data: sheetData,
        }, { responseType: 'blob' });
        this.downloadBlob(blob, 'cropsReport.xlsx');
        this.stopLoading();
      } catch (error) {
        console.error(error);
        this.stopLoading();
      }
    },
    async cropDownloadCsv() {
      this.startLoading()
      try {
        const csvData = this.cropsData.cropChart
        let csv = `${this.$t('Crop Name')}, ${this.$t('Farmers')}, ${this.$t('Farms')}, ${this.$t('Planted')}, ${this.$t('Planted Area')}, ${this.$t('Harvested')}, ${this.$t('Yield/acre')}\n`;
        csvData.forEach((row) => {
          csv += [row.cropName, row.farmersCount, row.farmsCount, row.plantedCount, this.getArea(row.plantedArea), row.harvestedCount, row.yield,].join(',');
          csv += "\n";
        });
        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'cropsReport.csv';
        anchor.click();
        this.stopLoading()
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },
    async cropDownloadPdf() {
      this.startLoading()
      try {
        await this.$http.post(`/reports/pdfs`, {
          title: this.$t('Crops Report'),
          list: this.cropsData.cropChart.map(row => {
            return {
              'Crop Name': row.cropName,
              'Farmers': row.farmersCount,
              'Farms': row.farmsCount,
              'Planted': row.plantedCount,
              'Planted Area': this.getArea(row.plantedArea),
              'Harvested': row.harvestedCount,
              'Yield/acre': row.yield
            }
          }),
          startDate: this.topChartStartDate,
          endDate: this.topChartEndDate,
        },
          {
            responseType: "arraybuffer",
          }
        ).then(({ data }) => {
          this.downloadBlobFile(data, "cropsReport.pdf");
          this.stopLoading();
        })
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },

    //Regional Report
    async regionDownloadExcel() {
      console.log(this.regionalList)
      this.startLoading();
      try {
        const data = this.regionalList;
        const sheetData = data.map(row => ({
          [this.$t('Region Name')]: row.country,
          [this.$t('Farmers')]: row.farmersCount,
          [this.$t('Farms')]: row.farmCount,
          [this.$t('Yield/acre')]: row.yield,
        }));
        const { data: blob } = await this.$http.post('/reports/generate-excel', {
          data: sheetData,
        }, { responseType: 'blob' });
        this.downloadBlob(blob, 'regionalReport.xlsx');
        this.stopLoading();
      } catch (error) {
        console.error(error);
        this.stopLoading();
      }
    },
    async regionDownloadCsv() {
      this.startLoading()
      try {
        const csvData = this.regionalList
        let csv = `${this.$t('Region Name')}, ${this.$t('Farmers')}, ${this.$t('Farms')}, ${this.$t('Yield/acre')}\n`;
        csvData.forEach((row) => {
          csv += [row.country, row.farmersCount, row.farmCount, row.yield].join(',');
          csv += "\n";
        });

        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'regionalReport.csv';
        anchor.click();
        this.stopLoading()
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },
    async regionDownloadPdf() {
      this.startLoading()
      try {
        await this.$http.post(`/reports/pdfs`, {
          title: this.$t('Regional Report'),
          list: this.regionalList.map(x => {
            return {
              "Region Name": x.country,
              "Farmers": x.farmersCount,
              "Farms": x.farmCount,
              "Yield/acre": x.yield
            }
          }),
          startDate: this.topChartStartDate,
          endDate: this.topChartEndDate,
        },
          {
            responseType: "arraybuffer",
          }
        ).then(({ data }) => {
          this.downloadBlobFile(data, "regionalReport.pdf");
          this.stopLoading();
        })
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },

    //Farmers
    async farmerDownloadExcel() {
      this.startLoading();
      try {
        const data = this.farmerList;
        const sheetData = data.map(row => ({
          [this.$t('Farmer Name')]: row.farmerName,
          [this.$t('Farms')]: row.farmCount,
          [this.$t('Avg. land/Acre')]: row.farmArea,
          [this.$t("Farm Size")]: this.getFarmerSize(row.farmArea),
          [this.$t('Crops')]: row.cropTypeCount || null,
          [this.$t('Yield/acre')]: row.yield,
        }));
        const { data: blob } = await this.$http.post('/reports/generate-excel', {
          data: sheetData,
        }, { responseType: 'blob' });
        this.downloadBlob(blob, 'farmersReport.xlsx');
        this.stopLoading();
      } catch (error) {
        console.error(error);
        this.stopLoading();
      }
    },
    getFarmerSize(acrNum) {
      const isNumber = typeof acrNum === 'number' || (!isNaN(acrNum) && typeof acrNum === 'string');
      if (!isNumber) return 'N/A'
      const hecterVal = Number(acrNum) / 2.47
      if (hecterVal <= 4) {
        return this.$t('Small Farmer')
      } else if (hecterVal > 4 && hecterVal <= 15) {
        return this.$t('Medium Farmer')
      } else {
        return this.$t('Large Farmer')
      }
    },
    async farmerDownloadCsv() {
      this.startLoading()
      try {
        const csvData = this.farmerList
        let csv = `${this.$t('Farmer Name')}, ${this.$t('Farms')}, ${this.$t('Avg. lang/Acre')}, ${this.$t('Farm Size')}, ${this.$t('Crops')}, ${this.$t('Yield/acre')}\n`;
        csvData.forEach((row) => {
          csv += [row.farmerName, row.farmCount, row.farmArea, this.getFarmerSize(row.farmArea), row.cropTypeCount, row.yield,].join(',');
          csv += "\n";
        });

        const anchor = document.createElement('a');
        anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        anchor.target = '_blank';
        anchor.download = 'farmersReport.csv';
        anchor.click();
        this.stopLoading()
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },
    async farmerDownloadPdf() {
      this.startLoading()
      try {
        await this.$http.post(`/reports/pdfs`, {
          title: this.$t('Farmers Report'),
          reportType: 'farmer',
          list: this.farmerList.map(x => {
            return {
              "Farmer Name": x.farmerName,
              "Farms": x.farmCount,
              "Avg. land/Acre": x.farmArea,
              "Farm Size": this.getFarmerSize(x.farmArea),
              "Crops": null,
              "Yield/acre": x.yield,
            }
          }),
          startDate: this.topChartStartDate,
          endDate: this.topChartEndDate,
        },
          {
            responseType: "arraybuffer",
          }
        ).then(({ data }) => {
          this.downloadBlobFile(data, "farmersReport.pdf");
          this.stopLoading();
        })
      } catch (err) {
        console.log(err)
        this.stopLoading()
      }
    },

  }
}