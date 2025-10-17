<template>
    <div class="paragraph-block" v-if="!preview">
        <div class="d-flex justify-space-between align-center mb-2">
            <span class="paragraph-label">Paragraph</span>
            <div class="d-flex align-center">
                <v-btn icon color="primary" @click="showSettings = true">
                    <v-icon>mdi-cog</v-icon>
                </v-btn>
                <v-btn icon color="error" class="ml-2" @click="$emit('delete')">
                    <v-icon>mdi-trash-can</v-icon>
                </v-btn>
            </div>
        </div>
        <div class="editor-wrapper">
            <Editor v-model="block.content" api-key="s53pebgzqrdjwvldy8noemxchq1kytxw1v4ys7cjvwz9cgye"
                :init="editorInit" />
        </div>
        <ComponentSettingsDialog v-model="showSettings" :settings="settings" @save="handleSaveSettings" />
    </div>
    <div v-else class="preview-paragraph" v-html="block.content"></div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import ComponentSettingsDialog from '../ComponentSettingDialog.vue'

export default {
    name: 'ParagraphBlock',
    components: { Editor, ComponentSettingsDialog },
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
            editorInit: {
                toolbar_mode: 'sliding',
                menubar: false,
                plugins: [
                    'anchor', 'autolink', 'charmap', 'link', 'lists', 'searchreplace', 'table', 'wordcount',
                    'media', 'visualblocks', 'code', 'fullscreen', 'nonbreaking', 'image', 'imagetools'
                ],
                toolbar: 'undo redo | bold italic underline strikethrough | styleselect | fontselect | fontsizeselect | link table | forecolor backcolor | align | numlist bullist indent outdent | charmap | removeformat',
                font_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
                fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
                toolbar_sticky: true
            },
            showSettings: false,
            settings: {
                bgColor: '#ffffff',
                fontColor: '#101010',
                font: 'Poppins'
            }
        }
    },
    methods: {
        handleSaveSettings(newSettings) {
            this.settings = newSettings
            // Apply settings to your block as needed
        }
    },
}
</script>

<style scoped>
.paragraph-block {
    background: #fafbfc;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 16px;
    position: relative;
}

.paragraph-label {
    font-size: 18px;
    font-weight: 500;
    color: #222;
}

.editor-wrapper {
    border-radius: 8px;
    background: #fff;
    margin-top: 8px;
    border: 1.5px solid #e0e0e0;
    padding: 2px 2px 0 2px;
}

.preview-paragraph {
    margin-bottom: 16px;
    font-size: 1rem;
    color: #222;
    line-height: 1.7;
}

/* Deep style for TinyMCE container */
:deep(.tox) {
    border: none !important;
    border-radius: 8px !important;
    box-shadow: none !important;
}
</style>