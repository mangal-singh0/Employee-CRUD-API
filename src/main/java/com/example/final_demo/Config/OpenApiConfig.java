package com.example.final_demo.Config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;

@Configuration
@OpenAPIDefinition(
		info = @Info(
				title = "Employee CRUD API",
				description = "Interactive documentation for the Employee CRUD service.",
				version = "v1",
				contact = @Contact(name = "Support", email = "support@example.com")
		)
)
public class OpenApiConfig {
	// Springdoc auto-configures Swagger UI; this class only enriches metadata.
}

