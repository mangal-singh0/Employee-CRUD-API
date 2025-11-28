package com.example.final_demo.Controller;

import com.example.final_demo.Entity.Employee;
import com.example.final_demo.Service.EmployeeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Slf4j
@RestController
@RequestMapping("/employees")
public class EmployeeController {
    @Autowired
    private EmployeeService service;

    @GetMapping("/{id}")
    public Employee getById(@PathVariable String id )   {
        log.info("GET Request: Fetch employee by ID {}", id);
        return service.getById(id);
    }
    @PostMapping
    public Employee create(@RequestBody Employee emp){
        log.info("POST Request: Create new employee");
        return service.create(emp);
    }

    @GetMapping
    public List<Employee> getall(){
        log.info("GET Request: Fetch all employees");
        return service.getall();

    }

    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable String id, @RequestBody Employee emp) {
        log.info("PUT Request: Update employee with ID {}", id);
        return service.update(id, emp);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable String id) {
        log.info("DELETE Request: Delete employee with ID {}", id);
        service.deleteById(id);
        return "Deleted Successfully";
    }
}
