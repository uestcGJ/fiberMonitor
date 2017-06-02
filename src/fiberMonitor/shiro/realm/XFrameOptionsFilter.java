package fiberMonitor.shiro.realm;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

public class XFrameOptionsFilter implements Filter {
	private String mode="SAMEORIGIN";
	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	@Override
	//配置X-Frame-Options，防止点击劫持（ClickJacking）
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain fc)
			throws IOException, ServletException {
		// TODO Auto-generated method stub
		  ((HttpServletResponse) response).addHeader("X-FRAME-OPTIONS", mode);
		  fc.doFilter(request, response);
		
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		// TODO Auto-generated method stub
		String configMode = filterConfig.getInitParameter("mode");
		if ( configMode != null && ( configMode.equals( "DENY" ) || configMode.equals( "SAMEORIGIN" ) ) ) {
		   mode = configMode;
		 
		}
	}

}
