package dao;

import java.util.List;

import domain.Route_marks;

public interface RouteMarksDao extends BaseDao<Route_marks>{

	List<Route_marks> findNearRouteMarks(float distance);

}
