import axios, { AxiosInstance } from 'axios';
import { DownloaderHelper } from 'node-downloader-helper';

export class FshareAPI {
  private _downloadPath: string;

  private _email: string;
  private _password: string;
  private _appKey: string;
  private _appName: string;

  private _token!: string;
  private _sessionId!: string;

  private _axiosInstance: AxiosInstance;

  constructor(downloadPath: string, credentials: { email: string; password: string; appKey: string; appName: string }) {
    this._downloadPath = downloadPath;

    this._email = credentials.email;
    this._password = credentials.password;
    this._appKey = credentials.appKey;
    this._appName = credentials.appName;

    this._axiosInstance = axios.create({ baseURL: 'https://api.fshare.vn' });
  }

  login = async () => {
    const { data } = await this._axiosInstance.request({
      url: '/api/user/login',
      method: 'POST',
      headers: {
        'User-Agent': this._appName,
      },
      data: {
        user_email: this._email,
        password: this._password,
        app_key: this._appKey,
      },
    });

    const { token, session_id }: { token: string; session_id: string } = data;

    this._token = token;
    this._sessionId = session_id;
  };

  logout = async () => {
    await this._axiosInstance.request({
      url: '/api/user/logout',
      method: 'GET',
      headers: {
        Cookie: this._sessionId,
      },
    });
  };

  refreshToken = async () => {
    const { data } = await this._axiosInstance.request({
      url: '/api/user/refreshToken',
      method: 'POST',
      headers: {
        'User-Agent': this._appName,
      },
      data: {
        token: this._token,
        app_key: this._appKey,
      },
    });

    const { token, session_id }: { token: string; session_id: string } = data;

    this._token = token;
    this._sessionId = session_id;
  };

  getProfile = async () => {
    const { data } = await this._axiosInstance.request({
      url: '/api/user/get',
      method: 'GET',
      headers: {
        'User-Agent': this._appName,
        Cookie: `session_id=${this._sessionId}`,
      },
    });
    console.log(data);
  };

  getDownloadDirectUrl = async ({ url, password }: { url: string; password?: string }) => {
    const { data } = await this._axiosInstance.request({
      url: '/api/session/download',
      method: 'POST',
      headers: {
        'User-Agent': this._appName,
        Cookie: `session_id=${this._sessionId}`,
      },
      data: {
        url,
        password,
        token: this._token,
        zipflag: 0,
      },
    });

    const { location }: { location: string } = data;
    return location;
  };

  download = async ({ directUrl }: { directUrl: string }) => {
    const downloader = new DownloaderHelper(directUrl, this._downloadPath);
    downloader
      .on('download', (downloadInfo) =>
        console.log('Download Begins: ', {
          name: downloadInfo.fileName,
          total: downloadInfo.totalSize,
        })
      )
      .on('end', (downloadInfo: any) => {
        console.log('Download Completed: ', downloadInfo);
      })
      .on('error', (err: any) => {
        console.error('Something happened', err);
      });

    await downloader.start();
  };
}
