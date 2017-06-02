

/**地标*/


package domain;

import javax.persistence.*;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name="LANDMARKS")
public class Landmarks {
	@Id
	@GenericGenerator(name="key_increment",strategy="increment")
	@GeneratedValue(generator="key_increment")
	@Column(name="ID",nullable=false,unique=true)
	private Long id;		//地标标识
	
	@Column(name="NAME",nullable=false)
	private String name;		//地标名
	
	@Column(name="LNG")	
	private String lng; 	//经度
	
	@Column(name="LAT")	
	private String lat; 	//纬度
	
	@Column(name="DISTANCE")	
	private float distance; 	//距离，与RTU的位置

	@Column(name="TYPE")	
	private String type; 	//地标类型  人井、接头、杆路、附挂、标石
	
	@Lob
	@Column(name="DESCRIPTION",columnDefinition="LONGTEXT")
	private String description;			//描述
	
/**----------new add------------*/	
	@Column(name="CREATE_TIME")
	private String create_time;			//create_time
	
	@Column(name="CREATE_USER")
	private String create_user;			//create_user
/**--------------------------*/
	
//foreign key
	//Optical_cables		所属光缆
	@ManyToOne(targetEntity=Optical_cables.class)
	@JoinColumn(name="CABLE_ID",referencedColumnName="ID")
	private Optical_cables optical_cable;
	public void setOptical_cable(Optical_cables optical_cable){
		this.optical_cable = optical_cable;
	}
	public Optical_cables getOptical_cable(){
		return this.optical_cable;
	}
	
//Landmarks()
	public Landmarks(){
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
	public void setLng(String lng){
		this.lng = lng;
	}
	public String getLng(){
		return this.lng;
	}
//lat
	public void setLat(String lat){
		this.lat = lat;
	}
	public String getLat(){
		return this.lat;
	}
//description
	public void setDescription(String description){
		this.description = description;
	}
	public String getDescription(){
		return this.description;
	}
	//create_user
	public void setCreateUser(String create_user){
			this.create_user = create_user;
	}
	public String getCreateUser(){
		return this.create_user;
	}		
	//create_time
	public void setCreateTime(String create_time){
		this.create_time = create_time;
	}
	public String getCreateTime(){
		return this.create_time;
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
