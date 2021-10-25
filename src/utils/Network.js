import axios from "axios";

const customAxios = axios.create({
	baseURL: "http://pms-api.myfreenet.ir/api/v1",
	headers: {
		client_id: "O.%Mq4FE&aos#t(o/L#sh783N@MqU@",
	},
});

export default customAxios;
