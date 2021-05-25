<template>
    <div class="accordion" role="tablist">
        <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block v-b-toggle.accordion-1 variant="info">Where is my ships ?</b-button>
            </b-card-header>
            <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <b-card-text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae culpa dicta doloremque pariatur perferendis ut. Amet animi commodi doloribus est libero minima molestias odio quas quod repellendus similique sint, voluptatibus?</b-card-text>
                </b-card-body>
            </b-collapse>
        </b-card>

        <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block v-b-toggle.accordion-2 variant="info">Accordion 2</b-button>
            </b-card-header>
            <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <b-card-text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae culpa dicta doloremque pariatur perferendis ut. Amet animi commodi doloribus est libero minima molestias odio quas quod repellendus similique sint, voluptatibus?</b-card-text>
                </b-card-body>
            </b-collapse>
        </b-card>

        <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block v-b-toggle.accordion-3 variant="info">Accordion 3</b-button>
            </b-card-header>
            <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                    <b-card-text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae culpa dicta doloremque pariatur perferendis ut. Amet animi commodi doloribus est libero minima molestias odio quas quod repellendus similique sint, voluptatibus?</b-card-text>
                </b-card-body>
            </b-collapse>
        </b-card>
    </div>
</template>

<script>
export default {
    name: 'FaqModal',
    data() {
        return {

        }
    }
}
</script>
