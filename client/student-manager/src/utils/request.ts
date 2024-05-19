import { dataApi } from "./api/dataApi";
import { Student } from "./student";

export interface Request {
    reqUrl: string;
    send(): Promise<any>
}

export class PostRequest implements Request {
    reqUrl: string;
    data: Student;

    constructor(reqUrl: string, data: Student) { 
        this.reqUrl = reqUrl;
        this.data = data;
    }

    async send(): Promise<any> {
        try {
            const res = await dataApi.post(this.reqUrl, this.data);
            console.log('POST Request - Success!');
            return res;
        }
        catch (error) {
            console.log('POST Request - Error!');
            throw error;
        }
    }
}

export class DeleteRequest implements Request {
    reqUrl: string;

    constructor(reqUrl: string) {
        this.reqUrl = reqUrl;
    }

    async send(): Promise<any> {
        try {
            const res = await dataApi.delete(this.reqUrl);
            console.log('DELETE Request - Success!');
            return res;
        }
        catch (error) {
            console.log('DELETE Request - Error!');
            throw error;
        }
    }
}

export class PutRequest implements Request {
    reqUrl: string;
    data: Student;

    constructor(reqUrl: string, data: Student) {
        this.reqUrl = reqUrl;
        this.data = data;
    }

    async send(): Promise<any> {
        try {
            const res = await dataApi.put(this.reqUrl, this.data);
            console.log('PUT Request - Success!');
            return res;
        }
        catch (error) {
            console.log('PUT Request - Error');
            throw error;
        }
    }
}