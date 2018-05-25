package com.masnegocio.landing.listeners;

import com.caronte.json.JSONObject;
import org.apache.log4j.Logger;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.FileInputStream;
import java.util.Enumeration;

public class MNServletContextListener implements ServletContextListener
{
    public static Logger LOGGER = null;
    public static JSONObject appProperties = null;
    private String pathWindows = "C:\\usr\\local\\apps\\properties\\";
    private String pathLinux = "/usr/local/apps/properties/";
    private String propertiesFile = "";
    private String projectName = "";
    private String osName = "";

    @Override
    public void contextInitialized(ServletContextEvent event)
    {
        projectName = event.getServletContext().getContextPath().replaceAll("/", "");
        LOGGER = Logger.getLogger( projectName + "-logger");
        osName = System.getProperty("os.name");
        propertiesFile = (osName.toUpperCase().contains("WINDOWS") ? pathWindows : pathLinux) + projectName + ".properties";

        LOGGER.info("Inicia despliegue de aplicativo " + projectName);
        LOGGER.info("Iniciando servicio " + projectName + " en sistema operativo " + osName);
        LOGGER.info("Cargando archivo de propiedades " + propertiesFile);

        try
        {
            java.util.Properties properties = new java.util.Properties();
            FileInputStream fileInputStream = new FileInputStream(propertiesFile);

            appProperties = new JSONObject();

            if (fileInputStream != null)
            {
                properties.load(fileInputStream);

                Enumeration<Object> propertiesEnumeration = properties.keys();

                while(propertiesEnumeration.hasMoreElements())
                {
                    String key = (String)propertiesEnumeration.nextElement();
                    String value = properties.getProperty(key);
                    appProperties.addPair(key, value);
                }

                fileInputStream.close();
            }
        }
        catch(Exception e)
        {
            LOGGER.error("Error al cargar el archivo de configuracion " + propertiesFile);
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent event)
    {
        LOGGER.info("Deteniendo aplicativo " + projectName);
    }
}
