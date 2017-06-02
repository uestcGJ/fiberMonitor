package fiberMonitor.bean;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import domain.Fiber_cores;
import domain.Frame_ports;
import domain.Jumper_frames;
import domain.Jumper_routes;
import domain.Landmarks;
import domain.Route_marks;
import domain.Routes;
import domain.Stations;
import service.FindService;
/****
 * 用于将光缆地标映射为光路地标的类
 * ***/
public class SyncRouteMarks extends Thread{
	 WebApplicationContext wac = ContextLoader.getCurrentWebApplicationContext();    
	 FindService findService=(FindService)wac.getBean("findService");
	 private long id;
	 //附加距离 对于不跨段的光路，间隔为0，对于跨段的光路，该距离指在该站之前，光缆的长度
	 private float interval=0.0f;
	  //光路地标信息
	 private  List<Route_marks> marks=new ArrayList<Route_marks>();
	 public SyncRouteMarks(long id){
		 this.id=id;
	 }
	 /***清除光路的全部地标***/
	 private void clearRouteMarks(){
		    WebApplicationContext wac = ContextLoader.getCurrentWebApplicationContext();    
			SessionFactory sessionFactory=(SessionFactory)wac.getBean("sessionFactory");
			Session session=sessionFactory.openSession();
			Transaction tx=session.beginTransaction();
	        Query q= session.createQuery("delete from Route_marks where route_id="+id);
	        q.executeUpdate();
	        session.flush();
	        tx.commit();
	        session.close();
	 }
	 /**将光缆地标转换为光路地标
		 * @param landmarks List<Landmarks>:要转换的光缆地标
	  * ****/
	 private void convertMark(List<Landmarks> landmarks){
		if(landmarks!=null&&!landmarks.isEmpty()){
			for(Landmarks landmark: landmarks){
				Route_marks mark=new Route_marks();
				mark.setLat(Float.parseFloat(landmark.getLat()));
				mark.setLng(Float.parseFloat(landmark.getLng()));
				mark.setDistance(landmark.getDistance()+interval);
				mark.setName(landmark.getName());
				mark.setType(landmark.getType());
				mark.setRoute(findService.findRoute(id));
				marks.add(mark);
			}
		}		  
	}
	public void run(){
		clearRouteMarks();
		Routes route=findService.findRoute(id);
		int crossNum=route.getCross_number();//跨站数
		List<Jumper_routes> jumpers=findService.findJumperRoutesByRouteId(id);//包含切换跳纤和光路跳纤
		Frame_ports portZ=null;//经过的第一根纤芯所连接的Z端配线架端口
		if(jumpers!=null&&jumpers.size()>0){
			for(Jumper_routes jumper:jumpers){
				if(!jumper.getIsSwitch()){//寻找光路跳纤
					 Fiber_cores fiber=findService.findFiberCoreByFrameIDandPortOrder(jumper.getFrame_id(), jumper.getFrame_port_order());
					 List<Landmarks> landMarks=findService.findLandmarksByOpticalCableId(fiber.getOptical_cable().getId());//拓扑经过的第一条光缆的各地标信息
					 interval+=Float.parseFloat(jumper.getLength())*0.001;//第一段地标的位置应加上光路跳纤的长度
					 convertMark(landMarks);
					 interval+=Float.parseFloat(fiber.getOptical_cable().getLength());//后续地标位置应加上当前端光缆的长度
					 Stations station=findService.findStation(fiber.getStation_z_id());
					 Frame_ports jumperOccpy=findService.findFramePortByFrameIdAndPortOrder(jumper.getFrame_id(), jumper.getFrame_port_order());
					 portZ=findService.findFramePortByFrameIdAndPortOrder(fiber.getFrame_z_id(), fiber.getPort_order_z());
					 if(portZ.getId()==jumperOccpy.getId()){//确定为Z端端口
							portZ=findService.findFramePortByFrameIdAndPortOrder(fiber.getFrame_a_id(), fiber.getPort_order_a());
							station=findService.findStation(fiber.getStation_a_id());
					 }
					 //将Z站作为光路地标
		   			 Route_marks mark=new Route_marks();
		   			 mark.setLat(Float.parseFloat(station.getLatitude()));
					 mark.setLng(Float.parseFloat(station.getLongitude()));
					 mark.setDistance(interval);
					 mark.setName(station.getStation_name());
					 mark.setType("站点");
					 mark.setRoute(route);
					 marks.add(mark);
					 break;
				}
			}
	   }
	   if(crossNum>0){//存在跨段,读取后续光缆
			while(--crossNum>=0){
				if(portZ.getConnection_type().contains("配线架跳纤")){
					Jumper_frames jumperFrame=findService.findJumperFrame(portZ.getConnection_id());
					Frame_ports crossFramePort=findService.findFramePortByFrameIdAndPortOrder(jumperFrame.getFrame_z_id(), jumperFrame.getPort_order_z());
					if(crossFramePort.getId()==portZ.getId()){//确定为Z端端口
						crossFramePort=findService.findFramePortByFrameIdAndPortOrder(jumperFrame.getFrame_a_id(), jumperFrame.getPort_order_a());
					}
					interval+=Float.parseFloat(jumperFrame.getLength())*0.001;//跨段之后的地标位置加上配线架跳纤的长度
					if(crossFramePort.getHas_fiber()){
						Fiber_cores crossFiber=findService.findFiberCoreByFrameIDandPortOrder(crossFramePort.getFrame().getId(), crossFramePort.getPort_order());
						List<Landmarks> landMarks=findService.findLandmarksByOpticalCableId(crossFiber.getOptical_cable().getId());//拓扑经过的跨段光缆的各地标信息
	
						convertMark(landMarks);
		   				interval+=Float.parseFloat(crossFiber.getOptical_cable().getLength());//间隔为光缆的长度
		   				Stations station=findService.findStation(crossFiber.getStation_z_id());
						portZ=findService.findFramePortByFrameIdAndPortOrder(crossFiber.getFrame_z_id(), crossFiber.getPort_order_z());
						if(portZ.getId()==crossFramePort.getId()){//确定为Z端端口
							portZ=findService.findFramePortByFrameIdAndPortOrder(crossFiber.getFrame_a_id(), crossFiber.getPort_order_a());
							station=findService.findStation(crossFiber.getStation_a_id());
						}
						//将Z站作为光路地标
		   		   		Route_marks mark=new Route_marks();
		   		   		mark.setLat(Float.parseFloat(station.getLatitude()));
		   				mark.setLng(Float.parseFloat(station.getLongitude()));
		   				mark.setDistance(interval);
		   				mark.setName(station.getStation_name());
		   				mark.setType("站点");
		   				mark.setRoute(route);
		   				marks.add(mark);
					}
			} 
		} 
	}
	/*****批量增加光路地标信息*****/ 
	WebApplicationContext wac = ContextLoader.getCurrentWebApplicationContext();    
	SessionFactory sessionFactory=(SessionFactory)wac.getBean("sessionFactory");
	Session session=sessionFactory.openSession();
	Transaction tx=session.beginTransaction();
	int count=0;
	marks.remove(marks.size()-1);//最后一个地标为Z站，移除
	for(Route_marks mark:marks){
		session.save(mark);
		count++;
		if(count%20==0){//到20个后存储一次
 		   session.flush();
 		   session.clear();
		}
	}
	//提交事务
	tx.commit();
	session.close();
	}
		  
}
