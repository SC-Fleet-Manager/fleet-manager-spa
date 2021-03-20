<template>
    <div class="animated fadeIn">
        <b-row>
            <b-col col md="6">
                <b-card header="Preferences" class="js-preferences">
                    <b-form>
                        <b-form-group>
                            <b-input-group prepend="My fleet link">
                                <b-form-input readonly
                                              id="my_fleet_link"
                                              type="text"
                                              v-model="myFleetLink"></b-form-input>
                                <b-input-group-append>
                                    <b-btn :variant="fleetLinkCopied ? 'success' : 'outline-success'"
                                           v-clipboard:copy="myFleetLink"
                                           v-clipboard:success="onCopyFleetLink">{{ fleetLinkCopied ? 'Copied' : 'Copy' }}</b-btn>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form-group>
                        <strong>Supporters preferences</strong>
                        <b-form-checkbox v-model="supporterVisible" @change="saveSupporterVisible" :disabled="savingPreferences" name="supporter-visibility" switch>
                            Display my name on Supporters page
                        </b-form-checkbox>
                    </b-form>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import axios from 'axios';
    import { mapMutations } from 'vuex';
    import VueClipboard from 'vue-clipboard2';

    import Vue from "vue";
    import Config from '@config/config.json';
    Vue.use(VueClipboard);

    export default {
        name: 'profile',
        components: {},
        data() {
            return {
                form: {
                    handle: null,
                },
                user: null,
                myFleetLink: null,
                savingPreferences: false,
                fleetLinkCopied: false,
                supporterVisible: null,
            }
        },
        created() {
        },
        methods: {
            ...mapMutations([]),
            saveSupporterVisible(value) {
                this.supporterVisible = value;
                this.savePreferences();
            },
            async savePreferences() {
                this.savingPreferences = true;
                const token = await this.$auth.getTokenSilently();
                if (!this.$auth.isAuthenticated) {
                    this.$toastr.e('Sorry, we are unable to save your preferences for the moment. Please try again later.');
                    return;
                }
                try {
                    await axios.post(`${Config.api_base_url}/api/profile/save-preferences`, {
                        supporterVisible: this.supporterVisible,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    this.$toastr.s('Changes saved');
                } catch (err) {
                    this.$toastr.e('Sorry, we are unable to save your preferences for the moment. Please try again later.');
                } finally {
                    this.savingPreferences = false;
                }
            },
            onCopyFleetLink() {
                this.fleetLinkCopied = true;
            },
        }
    }
</script>
