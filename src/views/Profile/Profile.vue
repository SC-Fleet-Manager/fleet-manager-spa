<template>
    <div class="animated fadeIn">
        <b-row>
            <b-col col md="6">
                <Preferences />
            </b-col>
        </b-row>
        <b-row>
            <b-col col md="6">
                <Security />
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Preferences from '@/components/Preferences';
import Security from '@/components/Security';

export default {
    name: 'profile',
    components: {Preferences, Security},
};
</script>
