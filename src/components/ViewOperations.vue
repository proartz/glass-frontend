<template>
    <v-layout row>
        <v-flex v-for="(operation, i) in filteredOperations" :key="i">
            <div class="caption grey--text">{{ operation.abbreviation }}</div>
            <v-btn :color="`${buttonColor[operation.status]}`"
                    :disabled="operation.status == operationStatusEnum.NIEROBIONE"
                    @click="changeStatus(operation, operationStatusEnum.ZROBIONE)"
                    small></v-btn>
        </v-flex>
        <v-flex>
            <v-btn icon v-if="isReadyForReset()" @click="resetOperations()">
                <v-icon>highlight_off</v-icon>
            </v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    props: [
       'operations',
    ],
    data() {
        return {
            filteredOperations: [],
            operationsEnum: {
                CIĘCIE: 'Cięcie',
                SZLIFOWANIE: 'Szlifowanie',
                WIERCENIE: 'Wiercenie',
                CNC: 'CNC',
                HARTOWANIE: 'Hartowanie',
                EMALIOWANIE: 'Emaliowanie',
                LAMINOWANIE: 'Laminowanie',
                WYDANIE: 'Wydanie'
            },
            operationAbbreviationsEnum: {
                CIĘCIE: 'C',
                SZLIFOWANIE: 'SZ',
                WIERCENIE: 'WI',
                CNC: 'CNC',
                HARTOWANIE: 'H',
                EMALIOWANIE: 'E',
                LAMINOWANIE: 'L',
                WYDANIE: 'WY'
            },
            operationStatusEnum: {
                NIEROBIONE: 'NIEROBIONE',
                ZAPLANOWANE: 'ZAPLANOWANE',
                GOTOWE_DO_REALIZACJI: 'GOTOWE_DO_REALIZACJI',
                ZROBIONE: 'ZROBIONE'
            },
            buttonColor: {
                NIEROBIONE: 'gray',
                ZAPLANOWANE: 'red',
                GOTOWE_DO_REALIZACJI: 'yellow',
                ZROBIONE: 'green'
            }
        }
    },
    methods: {
        createFilteredOperations() {
            var i = 0;
            var operation;
            for(operation in this.operationsEnum) {
                this.filteredOperations.push({
                    name: this.operationsEnum[operation],
                    abbreviation: this.operationAbbreviationsEnum[operation],
                    status: this.operationStatusEnum.NIEROBIONE
                });
            }
            this.updateFilteredOperations();
        },
        updateFilteredOperations() {
            var i;
            for(i = 0; i < this.operations.length; i++) {
                var index = this.searchFilteredOperations(this.operations[i].name);
                this.filteredOperations[index].id = this.operations[i].id;
                this.filteredOperations[index].status = this.operations[i].status;
            }
        },
        searchFilteredOperations(operationName) {
            var i;
            for(i = 0; i < this.filteredOperations.length; i++) {
                if(this.filteredOperations[i].name == operationName) {
                    return i;
                }
            }
        },
        isReadyForReset() {
            // if item is just added and not yet saved in the database
            // will have operation Cięcie in status ZAPLANOWANE
            // Cięcie have index 0 in filteredOperations
            if(this.filteredOperations[0].status == this.operationStatusEnum.ZAPLANOWANE) {
                return false;
            }
            return true;
        },
        resetOperations() {
            // invoke cahgeStatus(CIĘCIE, GOTOWE_DO_REALIZACJI)
            // it will never normally happend
            // so we use it as a reset message
            if(this.filteredOperations[0].status != this.operationStatusEnum.GOTOWE_DO_REALIZACJI) {
                this.changeStatus(this.filteredOperations[0], this.operationStatusEnum.GOTOWE_DO_REALIZACJI);
            }
        },
        changeStatus(operation, newStatus) {
            // 1st (cięcie, ZROBIONE) wants ZROBIONE
            // 2nd(reset) (cięcie, ZROBIONE) wants GOTOWE_DO_REALIZACJI
            if(operation.status == this.operationStatusEnum.GOTOWE_DO_REALIZACJI ||
                newStatus == this.operationStatusEnum.GOTOWE_DO_REALIZACJI) {
                this.loading = true;

                const changeStatusDto = {
                    operationId: operation.id,
                    newStatus: newStatus
                };

                console.log(changeStatusDto);

                this.$http.post('http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_BACKEND_PORT + '/changeStatus', changeStatusDto,
                {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(response => {
                    console.log(response.status);
                    this.$emit('refresh');
                    this.loading = false;
                }, response => {
                    console.log(response);
                });
          }
        },
    },
    watch: {
        operations:  function() {
            this.updateFilteredOperations();
        }
    },
    created() {
        this.createFilteredOperations();
        console.log("operations: " + this.operations);
    }
}
</script>

<style scoped>

div.btn__content {
  padding: 0;
}

.v-btn {
  min-width: 0;
  height: 16px;
}

.v-btn.NIEROBIONE {
    background-color: blue;
}

.v-btn.ZAPLANOWANE {
    background-color: red;
}

.v-btn.GOTOWE_DO_REALIZACJI {
    background-color: yellow;
}

.v-btn.ZROBIONE {
    background-color: green;
}

</style>