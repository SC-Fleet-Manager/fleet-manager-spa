<template>
    <div class="animated fadeIn">
        <router-link to="/my-fleet/edit-ships-and-fleet"><b-button variant="secondary" role="button">Back to fleet edit</b-button></router-link>
        <div class="card mt-4 p-4">
            <h4>Add a new ship</h4>
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
                    :state="!error"
                    ></b-form-input>
                    <b-form-invalid-feedback :state="!error">
                       Invalid Url.
                    </b-form-invalid-feedback>
                    <b-img :src="url" fluid alt="" class="col-xl-4 mt-3"></b-img>
                </b-form-group>
                <b-form-group
                    id="input-group-3"
                    label="Quantity:"
                    label-for="input-ship-quantity"
                >
                    <b-form-input
                    id="input-ship-quantity"
                    type="number"
                    placeholder="1"
                    v-model="quantity"
                    required
                    ></b-form-input>
                </b-form-group>
                <b-form-group>
                    <b-form-checkbox value="me">Add another ship</b-form-checkbox>
                </b-form-group>
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
                    quantity: 1
                },
                showImage: false,
                imageShip: '',
                error: false,
                errorMessage: 'Please enter a valid url',
                authorizedLinks: ['https://media.robertsspaceindustries.com/', 'https://robertsspaceindustries.com/media/', 'https://starcitizen.tools/images/thumb/']
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
                let authorized = this.authorizedLinks.some(el => this.imageShip.includes(el))
                if(authorized) {
                    if(this.error == true) this.error = false;
                    this.showImage = true;
                    return this.imageShip;
                } else if (this.imageShip !== '') {
                    this.error = true;
                    return this.errorMessage;
                }
            },
        }
    }
</script>
