/*
 * #%L
 * artifact-manager
 * %%
 * Copyright (C) 2023 VMware
 * %%
 * Build Tools for VMware Aria
 * Copyright 2023 VMware, Inc.
 * 
 * This product is licensed to you under the BSD-2 license (the "License"). You may not use this product except in compliance with the BSD-2 License.  
 * 
 * This product may include a number of subcomponents with separate copyright notices and license terms. Your use of these subcomponents is subject to the terms and conditions of the subcomponent's license, as noted in the LICENSE file.
 * #L%
 */
package com.vmware.pscoe.iac.artifact.aria.automation.models;

/**
 * Represents an ABX secret
 */
public class VraNgSecret {
	/**
	 * The id of the secret.
	 */
	public String id;

	/**
	 * The name of the secret.
	 */
	public String name;

	/**
	 * The orgId associated with the secret.
	 */
	public String orgId;

	/**
	 * the project ID associated with the secret.
	 */
	public String projectId;
}