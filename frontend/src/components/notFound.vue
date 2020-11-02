<template>
    <v-layout fill-height justify-center align-center style='opacity: .5'>
        <v-flex xs3 shrink>
                <sad style='height: 20vh;'> </sad>
        </v-flex>

        <v-flex xs8 shrink>
            <h1 class='display-1'> No such {{ name ? name : 'data' }} found  </h1>
        </v-flex>
    </v-layout>
</template>

<script>

import sad from '@/components/sad'
export default {

    props: {
        name: {
            type: String
        }
    },
    components: {
        sad
    }

}
</script>

<style>

</style>
