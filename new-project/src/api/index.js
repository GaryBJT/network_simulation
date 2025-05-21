import http from "@/utils/request";

export const pastData=(data)=>{
    return http.post('/simulate',data)
}