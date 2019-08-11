<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8 offset-md-2">

                <div class="card my-5">
                    <div class="card-body">

                        <picture-input 
                            ref="pictureInput"
                            width="600" 
                            height="600" 
                            margin="16" 
                            accept="image/jpeg,image/png" 
                            size="5" 
                            button-class="btn btn-danger"
                            :custom-strings="{
                                upload: '<h1>Bummer!</h1>',
                                drag: 'Drag a 😺 GIF or GTFO'
                            }"
                            @change="onChange">
                        </picture-input>

                        <select class="form-control my-3" v-model="category">
                            <option value="" selected="selected">Select a Category</option>
                            <option :value="category.id" v-for="category in categories" :key="category.id">
                                
                                {{ category.name }}

                            </option>
                        </select>




                        <input type="text" placeholder="Title" v-model="title" class=" my-3 form-control">
                        <wysiwyg v-model="content" />
                        <div class="text-center">
                            <button :disabled="loading" @click="createArticle()" class="btn btn-lg btn-success mt-3">
                                <i class="fas fa-spin fa-spinner" v-if="loading"></i>
                                 {{ loading ? '' : 'Create Article' }}
                            </button>
                        </div> 
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import PictureInput from 'vue-picture-input';
import Axios from 'axios';
import config from '@/config'

export default {


    beforeRouteEnter (to, from, next) {
        
        //If user is logged in goto Home Page else goto Next() which is Signup 
        if(!localStorage.getItem('auth')){

            return next({ path: "/login"});

        }

        next();
    },

    mounted() {
        this.getCategories();
    },
   components: {
       PictureInput,
   },
    data() {
        return {
            title: '',
            content: "",
            image: null,
            categories: [],
            category: "",
            loading: false,
        }
    },
    methods: {
        onChange(image){
            this.image = image;
        },
        createArticle(){
            //Validation Checks
            if(!this.title || !this.content || !this.category || !this.image){
                this.$noty.error('Please fill in all fields.');
               return;
            }

            this.loading = true;
            const form = new FormData();
            form.append('file', this.image);
            form.append('upload_preset', process.env.VUE_APP_CLOUDINARY_PRESET);
            form.append('api_key', process.env.VUE_APP_CLOUDINARY_API_KEY);

            Axios.post(process.env.VUE_APP_CLOUDINARY_URL, form).then(response => {

                //1. Arugement path
                Axios.post(`${config.apiUrl}/articles`, {

                    //2. Argument data
                    title: this.title,
                    content: this.content,
                    category_id: this.category,
                    imageUrl: response.data.secure_url

                }, {
                    //3. Argument header data for authorization token
                    //this api requires user token to make sure user is loggen in to create article..
                    //This is how we send authorization token in header.
                    headers: {

                        Authorization: `Bearer ${this.$root.auth.token}`
                    }

                })
                .then(() => {
                    this.loading = false;
                    this.$noty.success('Article created successfully');
                    this.$router.push('/');

                })
                .catch(() => {
                    this.loading = false;
                    this.$noty.error('OOps! Something went wrong');
                    
                });

            })
            .catch(() => {
                    this.loading = false;
                    this.$noty.error('OOps! Something went wrong');
                    
            });


        },
        getCategories(){
            const categories = localStorage.getItem("categories");
            if(categories){
                this.categories = JSON.parse(categories);
                return;
            }
            Axios.get(`${config.apiUrl}/categories`).then(response => {
                this.categories = response.data.categories;
                localStorage.setItem('categories', JSON.stringify(this.categories));
            });

        }
    },
    
}
</script>