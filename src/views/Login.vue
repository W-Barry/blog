<template>
<div class="row my-5">
    <div class="col-md-6 offset-md-3">
        <div class="card">
            <div class="card-body">
                <h3 class="text-center my-4">Login</h3>
                <div class="form-group">
                    <input v-bind:class="{'is-invalid': errors.email}" v-model="email" type="text" placeholder="Email" class="form-control">
                    <div class="errors" v-if="errors.email">
                        <small class="text-danger" :key="error" v-for="error in errors.email">{{ error }}</small>
                    </div>
                </div>
                 <div class="form-group">
                    <input v-bind:class="{'is-invalid': errors.password}" v-model="password" type="password" placeholder="Password" class="form-control">
                    <div class="errors" v-if="errors.password">
                        <small class="text-danger" :key="error" v-for="error in errors.password">{{ error }}</small>
                    </div>
                </div>
                 <div class="form-group text-center">
                    <button @click="loginUser()" :disabled="loading" class="btn btn-success form-control">
                        <i class="fas fa-spin fa-spinner" v-if="loading"></i>
                        {{ loading ? '' : 'Login' }}
                    </button>
                </div>
            </div>

        </div>

    </div>
</div>
   
</template>

<script>
import Axios from 'axios';
import config from '@/config'

export default {

    beforeRouteEnter (to, from, next) {
        
        //If user is logged in goto Home Page else goto Next() which is Login 
        if(localStorage.getItem('auth')){

            return next({ path: "/"});

        }

        next();
    },

    data(){

        return{
            email: '',
            password: '',
            errors: {},
            loading: false

        };
    },
    methods: {
        loginUser(){
            this.loading = true;
            Axios.post(`${config.apiUrl}/auth/login`,{

                email: this.email,
                password: this.password
        }).then(( response ) => {
            this.loading = false;
            this.$root.auth = response.data.data;
            localStorage.setItem('auth', JSON.stringify(response.data.data));

            // Success notification
            this.$noty.success("Successfully logged in.");

            this.$router.push('/');


        }).catch(({ response }) =>{
            this.loading = false;

            this.$noty.error("Oops, something went wrong!");
            //if credentials does not match on the server error response no. 401
            if(response.status === 401){

                this.errors = {
                    email: ["This credentials do not match our records."]
                }

            }else{
                this.errors = response.data;
            }

            

        })
        }
        
    },
    
    
}
</script>