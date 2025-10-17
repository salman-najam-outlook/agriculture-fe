<template>
    <v-row>
        <template v-for="i in clms">
            <v-col class="py-0" :cols="wdh" :key="i+'1'" >
                <v-skeleton-loader
                    :type="`list-item-avatar, list-item-${lines}-line,divider`"
                ></v-skeleton-loader>
            </v-col>
            <v-col cols="1" :key="i+'2'"></v-col>
        </template>
    </v-row>
</template>
<script>
export default {
    props: {
        clms: {
            type: Number,
            default: 6
        },
        wdh: {
            type: Number,
            default: 3
        },
        lines: {
            type: String,
            default: 'three'
        }
    }
}
</script>