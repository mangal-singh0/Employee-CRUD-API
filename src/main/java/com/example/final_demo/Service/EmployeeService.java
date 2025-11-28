package com.example.final_demo.Service;

import com.example.final_demo.Entity.Employee;
import com.example.final_demo.Repository.EmployeeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository repo;

    public Employee create(Employee emp) {
        log.info("Service: Creating employee");
        return repo.save(emp);
    }

    public List<Employee> getall() {
        log.info("Service: Fetching all employees");
        return repo.findAll();
    }

    public Employee getById(String id) {
        log.info("Service: Fetching employee with ID {}", id);
        return repo.findById(id).orElse(null);
    }

    public Employee update(String id, Employee emp) {
        log.info("Service: Updating employee with ID {}", id);

        Employee existing = repo.findById(id).orElse(null);

        if (existing == null) {
            log.warn("Service: Employee not found with ID {}", id);
            return null;
        }

        existing.setName(emp.getName());
        existing.setEmail(emp.getEmail());
        existing.setDepartments(emp.getDepartments());

        log.info("Service: Updated employee {}", existing.getName());
        return repo.save(existing);
    }

    public void deleteById(String id) {
        log.info("Service: Deleting employee with ID {}", id);
        repo.deleteById(id);
    }
}
