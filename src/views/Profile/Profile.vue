<template>
    <div class="animated fadeIn">
        <b-row>
            <b-col col md="6">
                <Security />
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from 'axios';
import Config from '@config/config.json';
import Security from '@/components/Security';

export default {
    name: 'profile',
    components: {Security},
    data() {
        return {};
    },
};
</script>
