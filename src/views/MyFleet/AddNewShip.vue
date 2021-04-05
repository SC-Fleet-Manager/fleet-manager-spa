<template>
    <div class="animated fadeIn">
        <router-link to="/my-fleet/edit-ships-and-fleet"><b-button variant="secondary" role="button">Back to fleet edit</b-button></router-link>
        <div>
            <b-form @submit="onSubmit">
                <b-form-group
                    id="input-group-1"
                    label="Ship name:"
                    label-for="input-ship-name"
                >
                    <b-form-input
                    id="input-ship-name"
                    v-model="form.name"
                    type="text"
                    placeholder="Cutlass black"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-2"
                    label="Ship image url ( only RSI or Citizen tool url):"
                    label-for="input-ship-image"
                >
                    <b-form-input
                    id="input-ship-image"
                    v-model="imageShip"
                    type="text"
                    placeholder="https://media.robertsspaceindustries.com/wj92rqzvhnecb/store_small.jpg"
                    required
                    ></b-form-input>
                </b-form-group>
                {{url}}
                <img v-if="showImage" v-bind:src="url" alt="" width="250px">
                <b-form-group
                    id="input-group-3"
                    label="Quantity:"
                    label-for="input-ship-quantity"
                >
                    <b-form-input
                    id="input-ship-quantity"
                    type="number"
                    placeholder="0"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-checkbox value="me">Add another ship</b-form-checkbox>
                <b-button type="submit" variant="primary">Add ship</b-button>
            </b-form>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'edit-ships-and-fleet',
        props: ['userHandle'],
        components: {

        },
        data() {
            return {
                form: {
                    name: '',
                },
                showImage: false,
                imageShip: '',
                errorMessage: 'Please enter a valid url'
            }
        },
        methods: {
            onSubmit(event) {
                event.preventDefault()
                alert(JSON.stringify(this.form))
            }
        },
        computed: {
            url() {
                if(this.imageShip.includes('https://media.robertsspaceindustries.com/')){
                    this.showImage = true
                    return this.imageShip
                }
                else {
                    return this.errorMessage
                }
            }
        }
    }
</script>
