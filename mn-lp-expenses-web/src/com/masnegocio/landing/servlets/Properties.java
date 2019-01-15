package com.masnegocio.landing.servlets;

import com.masnegocio.landing.listeners.MNServletContextListener;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class Properties extends HttpServlet
{
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
        super.doGet(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
        try
        {
            resp.setContentType("application/json;charset=UTF-8");
            PrintWriter out = resp.getWriter();
            out.println(MNServletContextListener.appProperties);
            out.close();
        }
        catch (Exception e)
        {
            e.printStackTrace();
            MNServletContextListener.LOGGER.error(this.getClass().getName(), e);
        }
    }
}
