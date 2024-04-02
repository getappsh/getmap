import { API, LOGIN } from "@app/common/utils/paths";
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import * as fs from "fs";
import * as https from 'https'
import { TokensDto } from "../dto/login/dto/tokens.dto";


@Injectable()
export class HttpConfigService {

  private readonly logger = new Logger(HttpConfigService.name);

  private isDistSecure: boolean
  private baseUrl: string;

  private username: string;
  private password: string;

  private token: string;
  private tokenExpiredTime: Date;

  constructor(
    public readonly httpService: HttpService,
    private configService: ConfigService,
  ) {

    this.baseUrl = `${this.configService.get("GETAPP_URL")}/${API}`
    this.isDistSecure = this.configService.get<boolean>("DIST_HTTP_PROTOCOL")

    this.httpService.axiosRef.defaults.baseURL = this.baseUrl;

    if (this.isDistSecure) {

      this.logger.log(`Destination server run in "secure" mode`)

      const httpsAgent = new https.Agent({
        ca: fs.readFileSync(process.env.CA_CERT_PATH),
        cert: fs.readFileSync(process.env.SERVER_CERT_PATH),
        key: fs.readFileSync(process.env.SERVER_KEY_PATH),
        // rejectUnauthorized: false
      })

      this.httpService.axiosRef.defaults.httpsAgent = httpsAgent
      this.httpService.axiosRef.defaults.headers = { ...this.httpService.axiosRef.defaults.headers, "auth_type": "CC" } as any

    } else {

      this.logger.log(`Destination server run in "unsecure" mode`)

      this.username = this.configService.get('GETAPP_USERNAME');
      this.password = this.configService.get('GETAPP_PASSWORD');

      this.setToken()
      this.setInspectors();
    }
  }
  setToken() {
    this.apiLogin()
  }

  async getTokenHeader() {
    const headers: { headers: any } = {} as { headers: any }
    if (!this.isDistSecure) {
      if (!this.token || new Date() > new Date(this.tokenExpiredTime.getTime() - 10 * 1000)) {
        await this.apiLogin()
      }
      headers.headers = { Authorization: `Bearer ${this.token}` }
    }
    return headers
  }

  setInspectors() {
    this.httpService.axiosRef.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (config.url != LOGIN) {
          config.headers = { ...config.headers, ...(await this.getTokenHeader()).headers }
        }
        return config;
      },
      error => {
        const config = error.config as InternalAxiosRequestConfig
        this.logger.error(`Req of path - ${config.url} failed - ${error.toString()}`)
        return Promise.reject(error);
      }
    );

  }

  async apiLogin() {
    this.logger.debug(`Login with user ${this.username}`);
    const url = LOGIN
    const body = { username: this.username, password: this.password };
    try {
      const tokenRes: TokensDto = (await this.httpService.axiosRef.post(url, body)).data;
      this.token = tokenRes.accessToken;
      this.tokenExpiredTime = new Date(tokenRes.expireAt);
    } catch (error) {
      this.logger.error("Error when trying to login - ", error.toString())
    }
  }
}