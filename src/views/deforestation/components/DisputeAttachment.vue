<template>
    <article v-if="s3Key" class="file-chip ma-0">
        <v-row>
            <v-col cols="1">
                <v-icon large :class="isIndonesianClient ? 'text-primary' : 'text-success'">
                {{ isDocument ?  'mdi-file-document-outline': 'mdi-file-image-outline' }}
                </v-icon>
            </v-col>
            <v-col cols="10" class="pl-2">
                <h4 :class="isIndonesianClient ? 'text-primary' : 'text-success'">{{ shortenedFileName }}</h4>
            </v-col>
            <v-col cols="1">
                <a :href="s3Location" :download="s3Key">
                <v-icon dark :color="isIndonesianClient ? 'primary' : 'success'">
                    mdi-download
                </v-icon>
                </a>
            </v-col>
        </v-row>
    </article>
</template>

<script>
import { isIndonesianClient } from "@/utils";
export default {
    props: {
        s3Key: {
            type: String,
            required: true,
        },
        s3Location: {
            type: String,
            required: true,
        }
    },
    computed: {
        isDocument() {
            const extension = this.$props.s3Location.split('.')[1];
            return ['docx', 'doc', 'pdf'].includes(extension);
        },
        shortenedFileName() {
            return this.$props.s3Location.split("/").slice(-2).join("/");
        },
        isIndonesianClient() {
            return isIndonesianClient();
        }
    }
}
</script>

<style lang="scss" scoped>
.file-chip {
  max-width: 640px;
  margin: 12px 0;
  padding: 24px;
  border-radius: 12px;
  background-color: rgba(14, 191, 103, 0.2);
}

.text-primary {
  color: #184980 !important;
}

.text-success {
  color: #0EBF67 !important;
}
</style>