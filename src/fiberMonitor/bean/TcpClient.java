package fiberMonitor.bean;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.Map;
/**
 * @author 心之&所系
 * create date:2016/11/04
 * 说明：采用TCP方式通信
 *      每次建立通信过程后应该释放连接
 * **/
public class TcpClient {
	  private  int port=8088;//服务器端口
	  private boolean isReady=false;
	  private boolean status=false;
	  private Socket socket=null;
	/**获取连接状态**/
	  public boolean getStatus(){
		  return this.status;
	  }
	  /**执行完成与否*/
	  public boolean getIsReady(){
		  return this.isReady;
	  }
	 /**构造函数
	  * @param ip 服务器IP地址**/ 
	public TcpClient(String ip){
		try {
			socket = new Socket();
			socket.connect(new InetSocketAddress(ip, port), 3500);//3.5秒的连接超时
			socket.setSoTimeout(4500);//4.5s的读取超时
			isReady=true;
			status=true;
		 } catch (IOException e) {
			// TODO Auto-generated catch block
			 isReady=true;//执行完
			 status=false;
		}
	}  
	 /**构造函数
	  * @param ip 服务器IP地址
	  * @param port 服务器端口**/ 
	public TcpClient(String ip,int port,int connectTimeOut){
		try {
			socket=new Socket(); 
			socket.connect(new InetSocketAddress(ip, port), connectTimeOut);//连接超时
			socket.setSoTimeout(4500);//4.5s的读取超时
			isReady=true;
			status=true;
		 } catch (IOException e) {
			// TODO Auto-generated catch block
			isReady=true;
			status=false;
		}
	}  
	/**利用TCP发送数据，数据格式为byte流
	    * @param data 欲发送的数据
	    * @return boolean
	   * **/
	public   boolean sendData(byte[] data){
	   try {
			   OutputStream connect =socket.getOutputStream();
			   connect.write(data);  // 发送
			   connect.flush();
			   return true;
		    } catch (IOException e) {
			// TODO Auto-generated catch block
				e.printStackTrace();
				return false;
		   }
	 }
	/**接收数据 
	 * @return byte[] or null**/
	public  byte[] recData(){
		try {
			  InputStream rec=socket.getInputStream();
			  byte[]recBbuf=new byte[512];//128个字节的接收数据缓冲区
			  int hasRead=0;
			  hasRead=rec.read(recBbuf);
			  ByteArrayOutputStream outStream = new ByteArrayOutputStream();//利用输出流来承接数据  
		      outStream.write(recBbuf,0,hasRead);
		      closeConn();//完成一次通信后释放连接
		      return outStream.toByteArray();//将接受数据转为字节数返回
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			/**错误时的回复码**/
			byte err[]={(byte)0xe7,(byte)0xe7,0x03,(byte)0xff,(byte)0xff,(byte)0xcf};
			return err;
		}
	}
	/**关闭连接
	 * @return boolean**/
	public boolean closeConn(){
		try {
			socket.close();
			return true;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
	}
	public static void main(String[] args) throws IOException{
		byte[] code=//TCPComndUtil.comndSetPower((float) -19.1);
		TCPComndUtil.comndGetPowerVal();
		String ip="192.168.0.120";
		TcpClient client=new TcpClient(ip,8088,1000);
		while(!client.getIsReady());//等待执行完
		boolean status=client.getStatus();
		if(status){
			status=client.sendData(code);
			byte []rec=client.recData();//接收数据
			client.closeConn();
			Map<String,Object> para=TCPComndUtil.anlyzeRecData(rec);
			System.out.println(para.get("status"));	
			System.out.println(para.get("pwVal"));	
		}
	}
}
