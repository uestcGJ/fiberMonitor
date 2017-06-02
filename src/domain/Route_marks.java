package domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name="ROUTE_MARKS")
public class Route_marks {
	@Id
	@GenericGenerator(name="key_increment",strategy="increment")
	@GeneratedValue(generator="key_increment")
	@Column(name="ID",nullable=false,unique=true)
	private Long id;		//地标标识
	
	@Column(name="NAME",nullable=false)
	private String name;		//地标名
	
	@Column(name="LNG")	
	private float lng; 	//经度
	
	@Column(name="LAT")	
	private float lat; 	//纬度
	
	@Column(name="DISTANCE")	
	private float distance; 	//距离，与RTU的位置

	@Column(name="TYPE")	
	private String type; 	//地标类型  人井、接头、杆路、附挂、标石
	
	
//foreign key
	//Routes		所属光路
	@ManyToOne(targetEntity=Routes.class)
	@JoinColumn(name="ROUTE_ID",referencedColumnName="ID")
	private Routes route;
	public void setRoute(Routes route){
		this.route = route;
	}
	public Routes getRoute(){
		return this.route;
	}
//id
	public Long getId(){
			return this.id;
	}
//name
	public void setName(String name){
		this.name = name;
	}
	public String getName(){
		return this.name;
	}
//lng
	public void setLng(float lng){
		this.lng = lng;
	}
	public float getLng(){
		return this.lng;
	}
//lat
	public void setLat(float lat){
		this.lat = lat;
	}
	public float getLat(){
		return this.lat;
	}
	//type
	public void setType(String type){
		this.type=type;
	}
	public String getType(){
		return this.type;
	}
	//distance
	public void setDistance(float distance){
		this.distance=distance;
	}
	public float getDistance(){
		return this.distance;
	}
}
