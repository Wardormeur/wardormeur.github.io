module.exports = function(grunt) {
	grunt.initConfig({
		harp_post: {
			post: {
				options : {
					destFolderBase : "../_harp/",
					path: "posts/",
					templatePath: "tpl/post.md",
				}
			}
		},
		harp : {
			server : {
				server: true,
				source : '../_harp/'
			},
			dist : {
				source : '../_harp/',
				dest : '../'
			}
		}
	});
 	
	grunt.loadNpmTasks('grunt-harp-post');
	grunt.loadNpmTasks('grunt-harp');
	grunt.registerTask('default', ['harp:dist']);
};










