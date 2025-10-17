<template>
    <div>
        <v-card
            flat
            class="pb-5"
        >
            <v-card-title class="text-subtitle-1 font-weight-bold">
                Survey Questions
            </v-card-title>
            <v-card-text>
                <v-data-table
                    :headers="headers"
                    :items="desserts"
                    v-sortable-data-table
                    @sorted="saveOrder"
                    item-key="name"
                    hide-default-footer
                    hide-default-header
                >
                <template v-slot:body="{ items }">
                    <tbody>
                        <tr
                            v-for="item in items"
                            :key="item.id"
                            style="position: relative; width: 0; height: 0"
                            @mouseover="selectItem(item)"
                            @mouseleave="selectItem(null)"
                        >
                                <td> {{ item.name}} </td>
                                <td> Test </td>
                                <div style="position: absolute; right: 10px; top:5px;" v-if="item === selectedItem">  
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn 
                                                x-small 
                                                fab
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                <v-icon>mdi-pencil</v-icon> 
                                            </v-btn>
                                        </template>
                                        <span>Edit</span>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn 
                                                x-small 
                                                fab
                                                v-bind="attrs"
                                                v-on="on"
                                                class="ml-2"
                                            >
                                                <v-icon>mdi-trash-can-outline</v-icon> 
                                            </v-btn>
                                        </template>
                                        <span>Delete</span>
                                    </v-tooltip>
                                </div>
                            </tr>
                        </tbody>
                    </template>
                </v-data-table>
                <v-divider></v-divider>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
// import Sortable from "@/directive/Sortable.js"
import Sortable from "sortablejs"
export default {
     data () {
        return {
            selectedItem: null,
            headers: [
                {
                    text: 'Survey Questions',
                    align: 'start',
                    sortable: false,
                    value: 'name',
                },
                {
                    text: 'Survey Questions',
                    align: 'start',
                    sortable: false,
                    value: 'name',
                },
            ],
            desserts: [
                {
                    id: 1,
                    name: 'Frozen Yogurt',
                },
                {
                    id: 2,
                    name: 'Ice cream sandwich',
                },
                {
                    id: 3,
                    name: 'Eclair',
                },
                {
                    id: 4,
                    name: 'Cupcake',
                },
                {
                    id: 5,
                    name: 'Gingerbread',
                },
                {
                    id: 6,
                    name: 'Test 6',
                },
                {
                    id: 7,
                    name: 'Test 7',
                },
                {
                    id: 8,
                    name: 'Test 8',
                },
            ],
        }
    },
    methods: {
        saveOrder (event) {
            const movedItem = this.desserts.splice(event.oldIndex, 1)[0];
            console.log('mItem', movedItem)
            this.desserts.splice(event.newIndex, 0, movedItem);
        },
        selectItem (item) {
            this.selectedItem = item
        },
    },
    directives: {
        sortableDataTable: {
            bind (el, binding, vnode) {
                const options = {
                    animation: 150,
                    onUpdate: function (event) {
                        vnode.child.$emit('sorted', event)
                    }
                }
                Sortable.create(el.getElementsByTagName('tbody')[0], options)
            }
        }
    },
}
</script>
