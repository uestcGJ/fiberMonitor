package daoImpl;

import java.util.ArrayList;
import java.util.List;

import dao.RouteMarksDao;
import domain.Route_marks;

public class RouteMarksDaoImpl  extends BaseDaoImpl<Route_marks> implements  RouteMarksDao{

	@Override
	public List<Route_marks> findNearRouteMarks(float dis) {
		// TODO Auto-generated method stub
		String sql=" select * from Route_marks where distance >=" +dis+" order by  (distance-"+dis+") limit 1 ";
		String sql2=" select * from Route_marks where distance <" +dis+" order by  ("+dis+"-distance)  limit 1";
		Route_marks beyond=super.findOneInSQL(sql, Route_marks.class);
		Route_marks below=super.findOneInSQL(sql2, Route_marks.class);
		List<Route_marks> marks=new ArrayList<Route_marks>();
		marks.add(below);
		marks.add(beyond);
		return marks;
	}

}
